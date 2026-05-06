/**
 * Monk Pi — Token Austerity Extension
 *
 * input:  🌐→EN translate → AAAK compress → LLM
 * output: LLM replies EN → 🌐 translate to user's language
 * Google Translate API, 0 cost, ~0.5s latency per direction.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { compressAAAK, compressionRatio } from "./compress.js";
import { needsTranslation, translateAndDetect, translate } from "./translate.js";
import { extractTextBlocks, hasCodeBlock } from "./utils.js";

const LABEL = "🧘 Monk";

const stats = {
	compressed: 0,
	tokensSaved: 0,
	origChars: 0,
	compChars: 0,
	translatedIn: 0,
	translatedOut: 0,
};

let userLang = "vi"; // detected user language, default VN

interface MonkCtx {
	ui: {
		setWidget?: (id: string, content: string[] | undefined) => void;
		setStatus?: (id: string, status: string | undefined) => void;
		notify?: (msg: string, type: string) => void;
	};
	hasUI: boolean;
}

function updateWidget(ctx: MonkCtx): void {
	if (!ctx.hasUI) return;
	const parts: string[] = [LABEL];
	if (stats.compressed > 0) {
		const pct = Math.round((1 - stats.compChars / stats.origChars) * 100);
		parts.push(`-${pct}%`);
	}
	const line = parts.join(" ");
	ctx.ui.setWidget?.("pi-monk", [line]);
	ctx.ui.setStatus?.("pi-monk", line);
}

export default function (pi: ExtensionAPI) {
	pi.on("input", async (event, ctx) => {
		if (event.source === "interactive") return { action: "continue" as const };
		if (!event.text || event.text.startsWith("/") || event.text.length < 8)
			return { action: "continue" as const };

		// Stage 1: detect language + translate to EN
		let text = event.text;
		if (needsTranslation(text)) {
			try {
				const r = await translateAndDetect(text, "en");
				if (r.text !== text) {
					text = r.text;
					if (r.detected !== "en") userLang = r.detected;
					stats.translatedIn++;
				}
			} catch {
				/* fallback — keep original */
			}
		} else {
			userLang = "en";
		}

		// Stage 2: AAAK compress translated EN text
		const comp = compressAAAK(text);
		if (comp !== text && comp.length > 0) {
			const saved = Math.ceil((event.text.length - comp.length) / 4);
			if (saved > 5) {
				stats.compressed++;
				stats.tokensSaved += saved;
				stats.origChars += event.text.length;
				stats.compChars += comp.length;
				if (ctx.hasUI)
					ctx.ui.notify?.(
						`🧘 Monk -${compressionRatio(event.text, comp)} (${saved} tok)`,
						"info",
					);
				updateWidget(ctx);
			}
			return { action: "transform" as const, text: comp };
		}
		// Translate changed text but compress no-op → send translated anyway
		if (text !== event.text) {
			return { action: "transform" as const, text };
		}
		return { action: "continue" as const };
	});

	pi.on("message_end", async (event, _ctx) => {
		if (event.message.role !== "assistant") return;
		if (userLang === "en") return; // no translation needed

		const content = event.message.content;
		const blocks = extractTextBlocks(content);
		if (blocks.length === 0) return;

		// Only translate text blocks without code
		const toTranslate = blocks.filter((b) => !hasCodeBlock(b.text));
		if (toTranslate.length === 0) return;

		const contentArr = [...(Array.isArray(content) ? content : [])];
		let changed = false;

		for (const b of toTranslate) {
			try {
				const t = await translate(b.text, "en", userLang);
				if (t && t !== b.text) {
					contentArr[b.idx] = { ...(contentArr[b.idx] as object), text: t };
					changed = true;
					stats.translatedOut++;
				}
			} catch {
				/* skip on failure */
			}
		}

		if (changed) {
			return { message: { ...event.message, content: contentArr } };
		}
	});

	pi.on("before_agent_start", async (event) => ({
		systemPrompt:
			event.systemPrompt +
			[
				"",
				"## Token Austerity Directives (Monk Mode)",
				"- Be CONCISE. Short sentences. Bullets > paragraphs.",
				"- No pleasantries, intro, outro. Answer directly.",
				"- Use compact key=value | pipe format when structured.",
				"- Plain English. Code: only relevant lines.",
				"- Never apologize or thank.",
			].join("\n"),
	}));

	pi.on("session_start", async (_e, ctx) => {
		userLang = "vi";
		if (ctx.hasUI) {
			updateWidget(ctx);
			ctx.ui.notify?.("🧘 Monk mode active — translate + AAAK compress", "info");
		}
	});

	pi.on("session_shutdown", async (_e, ctx) => {
		if (stats.compressed > 0 || stats.translatedIn > 0 || stats.translatedOut > 0) {
			const parts: string[] = [];
			if (stats.compressed) parts.push(`${stats.compressed} comp`);
			if (stats.translatedIn) parts.push(`${stats.translatedIn} in`);
			if (stats.translatedOut) parts.push(`${stats.translatedOut} out`);
			if (stats.tokensSaved) parts.push(`~${stats.tokensSaved} tok`);
			if (ctx.hasUI)
				ctx.ui.notify?.(`🧘 pi-monk: ${parts.join(", ")}`, "info");
		}
		if (ctx.hasUI) {
			ctx.ui.setWidget?.("pi-monk", undefined);
			ctx.ui.setStatus?.("pi-monk", undefined);
		}
	});
}

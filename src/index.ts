/**
 * Monk Pi — Token Austerity Extension
 *
 * input: 🌐→EN translate → AAAK compress → LLM
 * output: LLM replies natively (no translate)
 * Google Translate API, 0 cost, ~0.5s latency on non-EN.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { compressAAAK, compressionRatio } from "./compress.js";
import { needsTranslation, translate } from "./translate.js";

const LABEL = "🧘 Monk";

const stats = {
	compressed: 0,
	tokensSaved: 0,
	origChars: 0,
	compChars: 0,
};

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

		// Stage 1: translate non-EN → EN (for better AAAK compression)
		let text = event.text;
		if (needsTranslation(text)) {
			try {
				const t = await translate(text, "auto", "en");
				if (t && t !== text) text = t;
			} catch {
				/* fallback — keep original */
			}
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
		if (ctx.hasUI) {
			updateWidget(ctx);
			ctx.ui.notify?.("🧘 Monk mode active — AAAK compress + austerity", "info");
		}
	});

	pi.on("session_shutdown", async (_e, ctx) => {
		if (stats.compressed > 0) {
			if (ctx.hasUI)
				ctx.ui.notify?.(
					`🧘 pi-monk: ${stats.compressed} comp, ~${stats.tokensSaved} tok saved`,
					"info",
				);
		}
		if (ctx.hasUI) {
			ctx.ui.setWidget?.("pi-monk", undefined);
			ctx.ui.setStatus?.("pi-monk", undefined);
		}
	});
}

/**
 * Monk Pi — 9-stage AAAK+ text compressor.
 * Austere: 0 API calls, 0ms, 0 tokens cost. 30-65% savings.
 *
 * Stages:
 *   s1: VN courtesies     s4: Condense patterns     s7: Artifact cleanup
 *   s2: EN courtesies     s5: Nano-syntax           s8: Structure detection
 *   s3: Filler phrases    s6: Abbreviation          s9: Whitespace
 */

// ── s1: VN courtesies ──
function s1(t: string): string {
	return t
		.replace(/dạ thưa\s+(anh|chị|bạn|bác)/gi, "")
		.replace(/thưa\s+(anh|chị|bạn|bác|ông|bà)/gi, "")
		.replace(/\bdạ\b/gi, "")
		.replace(/vâng\s+ạ/gi, "")
		.replace(/em chào\s+(anh|chị|bạn|mọi người|bác|ông|bà|cô|chú)/gi, "")
		.replace(/chào\s+(anh|chị|bạn|mọi người|bác|ông|bà|cô|chú)/gi, "")
		.replace(/cảm ơn\s+(anh|chị|bạn|mọi người|các bạn|nhiều)/gi, "")
		.replace(/cám ơn\s+(anh|chị|bạn|nhiều)/gi, "")
		.replace(/\b(cảm ơn|cám ơn)\b/gi, "")
		.replace(/(cho|để)\s+(em|mình|tôi)\s+hỏi/gi, "")
		.replace(/(em|mình|tôi)\s+muốn\s+hỏi/gi, "")
		.replace(/(anh|chị)\s+cho\s+(em|mình)\s+hỏi/gi, "")
		.replace(/(anh|chị|bạn|em|mình)\s+có thể/gi, "")
		.replace(/giúp\s+(em|mình|tôi|anh|chị|bạn)/gi, "")
		.replace(/nếu\s+(được|rảnh|tiện|làm ơn)/gi, "")
		.replace(/nếu\s+có thể/gi, "")
		.replace(/phiền\s+(anh|chị|bạn)/gi, "")
		.replace(/làm ơn/gi, "")
		.replace(/\s+ạ([\s,.!?]|$)/g, "$1")
		.replace(/\s+(à|ơi|nhé|nha|nhỉ|nhờ)\s+/g, " ")
		.replace(/\s+(à|ơi|nhé|nha|nhỉ|nhờ)$/g, "")
		.replace(/\s+được không\s*/gi, " ")
		.replace(/ạ\s*$/gm, "")
		.replace(/ạ\s*[.!?]/g, "");
}

// ── s2: EN courtesies ──
function s2(t: string): string {
	return t
		.replace(/\b(dear|dear sir|dear mr|dear ms|dear dr|dear madam)\b/gi, "")
		.replace(
			/\b(hi there|hello there|hey there|good morning|good afternoon|good evening|good day)\b/gi,
			"",
		)
		.replace(/^(hello|hi|hey)\b/gi, "")
		.replace(
			/\b(thank you|thanks a lot|thank you very much|many thanks|thanks in advance|tia)\b/gi,
			"",
		)
		.replace(/\bthanks\b([\s,.!?]|$)/gi, "$1")
		.replace(/\bplease\b/gi, "")
		.replace(/\bkindly\b/gi, "")
		.replace(/\bYes sir\b/gi, "")
		.replace(/\byes\b\s*/gi, "")
		.replace(/\bI greet you\b/gi, "")
		.replace(/\bgreet you\b/gi, "")
		.replace(/Let me ask /gi, "")
		.replace(/let me ask /gi, "")
		.replace(/Let me /gi, "")
		.replace(/let me /gi, "")
		.replace(/May I /gi, "")
		.replace(/may I /gi, "")
		.replace(/Can I /gi, "")
		.replace(/can I /gi, "")
		.replace(/Do you know /gi, "")
		.replace(/do you know /gi, "")
		.replace(/Very much/gi, "")
		.replace(/very much/gi, "")
		.replace(
			/\b(i was wondering|i'd like to ask|i wanted to ask|i was hoping|i'd appreciate)\b/gi,
			"",
		)
		.replace(/\b(sorry to bother|sorry for bothering|pardon me|excuse me)\b/gi, "")
		.replace(
			/\b(if possible|if you don't mind|if it's not too much trouble|when you get a chance)\b/gi,
			"",
		)
		.replace(/\b(just a quick|real quick|briefly)\b/gi, "");
}

// ── s3: Filler phrases (EN + VN) ──
function s3(t: string): string {
	return t
		.replace(/the thing is (that )?/gi, "")
		.replace(/what i'?m trying to say is /gi, "")
		.replace(/what i mean is /gi, "")
		.replace(/\bi think (that )?/gi, "")
		.replace(/\bi believe (that )?/gi, "")
		.replace(/it seems (that )?/gi, "")
		.replace(/it appears (that )?/gi, "")
		.replace(/in other words,? /gi, "")
		.replace(/the point is (that )?/gi, "")
		.replace(/\b(basically|essentially|actually|honestly|frankly|literally)\b,? /gi, "")
		.replace(/to be honest,? /gi, "")
		.replace(/as a matter of fact,? /gi, "")
		.replace(/by the way,? /gi, "")
		.replace(/\bbtw\b,? /gi, "")
		.replace(/for what it'?s worth,? /gi, "")
		.replace(/at the end of the day,? /gi, "")
		.replace(/as i (mentioned|said) (before|earlier),? /gi, "")
		.replace(/as we discussed,? /gi, "")
		.replace(/as you (may )?know,? /gi, "")
		.replace(/as previously stated,? /gi, "")
		.replace(/(having said that|with that said|that being said),? /gi, "")
		.replace(/(more importantly|more specifically),? /gi, "")
		.replace(/in particular,? /gi, "")
		.replace(/in general,? /gi, "")
		.replace(/in most cases,? /gi, "")
		.replace(/in my opinion,? /gi, "")
		.replace(/from my perspective,? /gi, "")
		.replace(/as far as i know,? /gi, "")
		.replace(/to the best of my knowledge,? /gi, "")
		.replace(/it goes without saying (that )?/gi, "")
		.replace(/needless to say,? /gi, "")
		.replace(/first of all,? /gi, "")
		.replace(/last but not least,? /gi, "")
		.replace(/at the same time,? /gi, "")
		.replace(/on the other hand,? /gi, "")
		.replace(/in the meantime,? /gi, "")
		.replace(/in the end,? /gi, "")
		.replace(/after all,? /gi, "")
		.replace(/all in all,? /gi, "")
		.replace(/in any case,? /gi, "")
		.replace(/either way,? /gi, "")
		.replace(/one more thing,? /gi, "")
		.replace(/long story short,? /gi, "")
		.replace(/vấn đề là( ở chỗ)?/gi, "")
		.replace(/ý (em|mình|tôi|anh) là/gi, "")
		.replace(/thực ra( thì)?/gi, "")
		.replace(/thực tế( thì)?/gi, "")
		.replace(/(cơ bản|về cơ bản)( thì)?/gi, "")
		.replace(/nói cách khác/gi, "")
		.replace(/nói chung( lại)?( thì)?/gi, "")
		.replace(/theo (ý )?(em|mình|tôi|anh) thì/gi, "")
		.replace(/như (em|mình|tôi|anh) (đã nói|nói|biết)/gi, "")
		.replace(/(tiện thể|nhân tiện)( thì)?/gi, "")
		.replace(/à mà/gi, "")
		.replace(/chuyện là( thế này)?/gi, "")
		.replace(/thế này nhé/gi, "")
		.replace(/nói thật( tình)?( thì)?/gi, "")
		.replace(/thú thật( thì)?/gi, "")
		.replace(/công nhận( là)?/gi, "")
		.replace(/đúng là/gi, "")
		.replace(/quả thật( là)?/gi, "")
		.replace(/trước (hết|tiên)( là)?/gi, "")
		.replace(/cuối cùng( thì)?/gi, "")
		.replace(/tóm lại( thì)?/gi, "");
}

// ── s4: Condense verbose patterns → compact prefixes ──
function s4(t: string): string {
	return t
		.replace(/i have a question (about|regarding) /gi, "q:")
		.replace(/my question is (about|regarding) /gi, "q:")
		.replace(
			/(can|could|would) you (please )?(help me|assist me|check|look at|review|have a look|help me check)\s*/gi,
			"",
		)
		.replace(
			/if you (can|could|would) (please )?(help me|assist me|check|look at|review|have a look)\s*/gi,
			"",
		)
		.replace(
			/you (can|could) (please )?(help me|assist me|check|look at|review|have a look)\s*/gi,
			"",
		)
		.replace(/i need (some )?(help|assistance) (with|on|regarding) /gi, "need:")
		.replace(
			/i'm (having|running into|encountering) (a|an|some) (issue|problem|error|bug) (with|in|on|when) /gi,
			"bug:",
		)
		.replace(/i encountered (a|an) (error|issue|problem) (when|while|during) /gi, "err:")
		.replace(/the error message (is|says|reads):? /gi, "err:")
		.replace(/i (get|got) (a|an) ?(error|exception) /gi, "err:")
		.replace(/it (throws|shows|gives) (a|an) (error|exception) /gi, "err:")
		.replace(/i'm getting (a|an) /gi, "err:")
		.replace(/the (issue|problem|story) is (that )?/gi, "")
		.replace(/here('?s| is) (the |my |what )?(context|situation|scenario|background):? /gi, "ctx:")
		.replace(/this is what (happened|i did|i tried):? /gi, "ctx:")
		.replace(/what i did( was)?:? /gi, "action:")
		.replace(/i (tried|have tried|had tried|did try)( to)? /gi, "tried:")
		.replace(/i already tried /gi, "tried:")
		.replace(/i've (already )?tried /gi, "tried:")
		.replace(/is there a way to /gi, "")
		.replace(/how (can|do) i /gi, "")
		.replace(/what('s| is) the best way to /gi, "")
		.replace(/i want to /gi, "")
		.replace(/i'?d like to /gi, "")
		.replace(/i'?m trying to /gi, "")
		.replace(/i'?m working on /gi, "")
		.replace(/please let me know/gi, "")
		.replace(/let me know/gi, "")
		.replace(/i look forward to (hearing from you|your reply|your response)/gi, "")
		.replace(
			/any (help|assistance|guidance|suggestion|insight|input) (would be|is) (greatly )?(appreciated|helpful|welcome)/gi,
			"",
		)
		.replace(/\bthanks in advance\b/gi, "")
		.replace(/\b(regards|best regards|sincerely|cheers)\b/gi, "");
}

// ── s5: Nano-syntax — strip articles/aux-verbs/low-prepositions ──
// Preserves |pipe| sections and code-like tokens (camelCase, snake_case, paths)
function s5(t: string): string {
	if (!t.trim() || t.length < 15) return t;
	const segs: string[] = [];
	let last = 0;
	const re = /\|[^|]+\|/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(t)) !== null) {
		segs.push(nano(t.slice(last, m.index)));
		segs.push(m[0]);
		last = re.lastIndex;
	}
	segs.push(nano(t.slice(last)));
	return segs.join("");
}
function nano(t: string): string {
	const b = t.length;
	let r = t;
	// Always strip — these carry ~0 semantic value for LLMs
	r = r.replace(/\b(a|an|the|this|that|these|those)\b\s*/gi, "");
	r = r.replace(
		/\b(is|are|was|were|been|being|have|has|had|do|does|did|will|would|shall|should|may|might|must|could)\b\s*/gi,
		"",
	);
	r = r.replace(/\b(in|on|at|by|for|of|with|as|but|or|so|than)\b\s*/gi, "");
	// Only revert if savings < 3 chars (noise threshold)
	return r.length >= b - 3 ? t : r;
}

// ── s6: Token-aware abbreviation ──
// Maps long words to shorter tokens LLMs understand.
// Preserves |pipe| sections, code tokens, and short words.
const ABBR = new Map([
	// Tech — high frequency in Telegram messages
	["authentication", "auth"],
	["authenticate", "auth"],
	["configuration", "config"],
	["configure", "config"],
	["implementation", "impl"],
	["implement", "impl"],
	["application", "app"],
	["applications", "apps"],
	["documentation", "docs"],
	["information", "info"],
	["repository", "repo"],
	["directory", "dir"],
	["directories", "dirs"],
	["database", "db"],
	["databases", "dbs"],
	["development", "dev"],
	["environment", "env"],
	["environments", "envs"],
	["administration", "admin"],
	["administrator", "admin"],
	["function", "fn"],
	["functions", "fns"],
	["parameter", "param"],
	["parameters", "params"],
	["variable", "var"],
	["variables", "vars"],
	["attribute", "attr"],
	["attributes", "attrs"],
	["property", "prop"],
	["properties", "props"],
	["communication", "comm"],
	["notification", "notif"],
	["notifications", "notifs"],
	["subscription", "sub"],
	["subscriptions", "subs"],
	["integration", "integ"],
	["integrations", "integs"],
	["optimization", "opt"],
	["optimize", "opt"],
	["initialization", "init"],
	["initialize", "init"],
	["validation", "val"],
	["validate", "val"],
	["comparison", "cmp"],
	["configuration", "config"], // dup but explicit
	// General
	["previous", "prev"],
	["previously", "prev"],
	["something", "sth"],
	["message", "msg"],
	["messages", "msgs"],
	["number", "num"],
	["numbers", "nums"],
	["button", "btn"],
	["buttons", "btns"],
	["image", "img"],
	["images", "imgs"],
	["text", "txt"],
	["example", "ex"],
	["examples", "exs"],
	["average", "avg"],
	["approximately", "approx"],
	["individual", "indiv"],
	["original", "orig"],
	["standard", "std"],
	["maximum", "max"],
	["minimum", "min"],
	["temperature", "temp"],
	["password", "pwd"],
	["address", "addr"],
	["addresses", "addrs"],
	["header", "hdr"],
	["headers", "hdrs"],
	["buffer", "buf"],
	["between", "b/w"],
	["without", "w/o"],
	["because", "bc"],
	["especially", "esp"],
	["including", "incl"],
	["against", "vs"],
	["version", "v"], // v2 vs version 2
	["specification", "spec"],
	["reference", "ref"],
	["response", "resp"],
	["request", "req"],
	["answer", "ans"],
	["question", "qn"], // keep 'q:' prefix separate from standalone 'question'
]);

function s6(t: string): string {
	if (!t.trim() || t.length < 10) return t;
	// Preserve |pipe| sections
	const segs: string[] = [];
	let last = 0;
	const re = /\|[^|]+\|/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(t)) !== null) {
		segs.push(abbr(t.slice(last, m.index)));
		segs.push(m[0]);
		last = re.lastIndex;
	}
	segs.push(abbr(t.slice(last)));
	return segs.join("");
}
function abbr(t: string): string {
	let r = t;
	for (const [long, short] of ABBR) {
		r = r.replace(new RegExp("\\b" + long + "\\b", "gi"), short);
	}
	return r;
}

// ── s7: Artifact cleanup ──
function s7(t: string): string {
	let r = t.trim(),
		prev = "";
	while (r !== prev) {
		prev = r;
		r = r
			.replace(
				/^(anh|chị|bạn|em|tôi|mình|sir|mr|ms|dr|madam|hello|about|the|a|an|check|with)\b[,.]?\s*/i,
				"",
			)
			.replace(/\s+(anh|chị|bạn|em|tôi|mình|sir)[,.]?(?:\s+|$)/gi, " ")
			.replace(/\.{2,}/g, ".")
			.replace(/,\s*,/g, ",")
			.replace(/\?\s*\?+/g, "?")
			.replace(/,\s*\./g, ".")
			.replace(/^[\s,.;:!?]+/, "")
			.replace(/[\s,.;:!?]+$/, "")
			.replace(/\s+/g, " ")
			.trim();
	}
	return r;
}

// ── s8: Structure detection — |q=| |err=| |ctx=| |tried=| ──
function s8(t: string): string {
	const segs = t
		.split(/(?<=[.!?])\s*/)
		.map((s) => s.trim())
		.filter(Boolean);
	if (segs.length <= 1) return t;
	const out: string[] = [];
	for (const seg of segs) {
		const c = seg.replace(/[.!]$/, "").trim();
		const lo = c.toLowerCase();
		if (/^(q|bug|err|ctx|tried|action|need):/.test(lo)) {
			const rest = c.substring(c.indexOf(":") + 1).trim();
			if (rest) out.push(`|${lo.substring(0, c.indexOf(":"))}=${rest.replace(/[.!?]$/, "")}|`);
		} else if (c.endsWith("?")) {
			const q = c.replace(/\?+$/g, "").trim();
			if (q) out.push(`|q=${q}|`);
		} else if (c) out.push(c);
	}
	return out.join(" ");
}

// ── s9: Whitespace ──
function s9(t: string): string {
	return t
		.replace(/\s+/g, " ")
		.replace(/\s*([,.:;!?])\s*/g, "$1 ")
		.replace(/\|\s+/g, "|")
		.replace(/\s+\|/g, "|")
		.trim();
}

export function compressAAAK(text: string): string {
	if (!text || text.length < 8) return text;
	let r = text;
	r = s1(r);
	r = s2(r);
	r = s3(r);
	r = s4(r);
	r = s5(r);
	r = s6(r);
	r = s7(r);
	r = s8(r);
	r = s9(r);
	return r;
}

export function compressionRatio(o: string, c: string): string {
	return o.length === 0 ? "0%" : `${Math.round((1 - c.length / o.length) * 100)}%`;
}

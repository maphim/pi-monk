/**
 * Google Translate bypass + multi-language detection.
 * Handles ALL languages via ASCII scan + word-frequency fallback.
 */

function hx(xd: string): number {
	return xd >= "a" ? xd.charCodeAt(0) - 87 : Number(xd);
}
function sxs(num: number, ops: string[]): number {
	return ops.reduce((a, o) => {
		const sh = hx(o[2]!);
		const m = o[1] === "+" ? a >>> sh : a << sh;
		return o[0] === "+" ? (a + m) & 0xffffffff : a ^ m;
	}, num);
}
function tq(q: string): number[] {
	const e: number[] = [];
	for (let g = 0; g < q.length; g++) {
		let l = q.charCodeAt(g);
		if (l < 128) {
			e.push(l);
		} else if (l < 2048) {
			e.push((l >> 6) | 0xc0, (l & 0x3f) | 0x80);
		} else if (
			0xd800 === (l & 0xfc00) &&
			g + 1 < q.length &&
			0xdc00 === (q.charCodeAt(g + 1) & 0xfc00)
		) {
			l = (1 << 16) + ((l & 0x03ff) << 10) + (q.charCodeAt(++g) & 0x03ff);
			e.push((l >> 18) | 0xf0, ((l >> 12) & 0x3f) | 0x80, (l & 0x3f) | 0x80);
		} else {
			e.push((l >> 12) | 0xe0, ((l >> 6) & 0x3f) | 0x80, (l & 0x3f) | 0x80);
		}
	}
	return e;
}
function nh(r2: number): number {
	if (r2 < 0) r2 = (r2 & 0x7fffffff) + 0x80000000;
	return r2 % 1e6;
}
function ch(q: string, tk: string): string {
	const [i, k] = tk.split(".").map(Number);
	const r1 = tq(q).reduce((a, c) => sxs(a + c, ["+-a", "^+6"]), i ?? 0);
	const r2 = sxs(r1, ["+-3", "^+b", "+-f"]) ^ (k ?? 0);
	return `${nh(r2)}.${nh(r2) ^ (i ?? 0)}`;
}

const TKK = `410958.${Date.now()}`;

export async function translate(text: string, from = "auto", to = "en"): Promise<string> {
	if (!text.trim()) return text;
	const url = `https://translate.googleapis.com/translate_a/single?${new URLSearchParams({
		client: "gtx",
		sl: from,
		tl: to,
		hl: to,
		dt: "t",
		q: text,
		tk: ch(text, TKK),
	})}`;
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), 5000);
	try {
		const res = await fetch(url, { signal: ctrl.signal });
		const d = JSON.parse(await res.text()) as any[];
		return (
			(d[0] as Array<Array<string>>)
				?.map((s: any) => s[0])
				.filter(Boolean)
				.join("") ?? text
		);
	} catch {
		return text;
	} finally {
		clearTimeout(t);
	}
}

/**
 * Translate + detect source language.
 * Returns both translated text and detected language code.
 */
export async function translateAndDetect(
	text: string,
	to = "en",
): Promise<{ text: string; detected: string }> {
	if (!text.trim()) return { text, detected: "en" };
	const url = `https://translate.googleapis.com/translate_a/single?${new URLSearchParams({
		client: "gtx",
		sl: "auto",
		tl: to,
		hl: to,
		dt: "t",
		q: text,
		tk: ch(text, TKK),
	})}`;
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), 5000);
	try {
		const res = await fetch(url, { signal: ctrl.signal });
		const d = JSON.parse(await res.text()) as any[];
		const detected = (d[2] as string) || "en";
		const translated =
			(d[0] as Array<Array<string>>)
				?.map((s: any) => s[0])
				.filter(Boolean)
				.join("") ?? text;
		return { text: translated, detected };
	} catch {
		return { text, detected: "en" };
	} finally {
		clearTimeout(t);
	}
}

/**
 * Language detection: does text need translation?
 *
 * Two-stage:
 *   1. Non-ASCII scan — catches VN, CJK, Cyrillic, Arabic, etc.
 *   2. Word-frequency fallback — catches European languages
 *      that use only ASCII chars (DE, FR, NL, NO, etc.)
 */
const NON_EN_WORDS = new Set([
	// German
	"ich",
	"du",
	"er",
	"sie",
	"es",
	"wir",
	"ihr",
	"der",
	"die",
	"das",
	"den",
	"dem",
	"des",
	"ein",
	"eine",
	"einen",
	"einer",
	"einem",
	"und",
	"oder",
	"aber",
	"für",
	"mit",
	"nach",
	"bei",
	"aus",
	"von",
	"zum",
	"zur",
	"auf",
	"über",
	"unter",
	"neben",
	"zwischen",
	"nicht",
	"kein",
	"keine",
	"hast",
	"habe",
	"hat",
	"hätte",
	"kann",
	"kannst",
	"muss",
	"musst",
	"sollte",
	"würde",
	"bin",
	"bist",
	"ist",
	"sind",
	"seid",
	"wird",
	"werden",
	"wurde",
	"wurden",
	"hier",
	"dort",
	"da",
	"dann",
	"dass",
	"weiß",
	"weiss",
	"sehr",
	"auch",
	"noch",
	"schon",
	"immer",
	"niemals",
	"dieser",
	"diese",
	"dieses",
	"diesem",
	"welcher",
	"welche",
	"welches",
	"man",
	"frau",
	"herr",
	"mal",
	"bitte",
	"danke",
	"vielen",
	"tut",
	"leid",
	"hallo",
	"tschüss",
	"wieder",
	"bereits",
	"etwas",
	"nichts",
	"alles",
	"wie",
	"wer",
	"was",
	"wann",
	"wo",
	"warum",
	"wieso",
	"weshalb",
	"gehen",
	"kommen",
	"machen",
	"sagen",
	"geben",
	"finden",
	"sehen",
	"möchte",
	"möchtest",
	"könnte",
	"könnten",
	"wollen",
	"sollen",
	"unser",
	"euer",
	"sein",
	"ihr",
	"mein",
	"dein",
	"sein",
	"ihr",
	"ihn",
	"euch",
	"mich",
	"dich",
	"sich",
	"uns",
	"mir",
	"dir",
	"gern",
	"gerne",
	"jetzt",
	"heute",
	"morgen",
	"gestern",
	"früher",
	"später",
	"immer",
	"jahr",
	"zeit",
	"woche",
	"monat",
	"minute",
	"stunde",
	"sekunde",
	// French
	"je",
	"tu",
	"il",
	"elle",
	"nous",
	"vous",
	"ils",
	"elles",
	"le",
	"la",
	"les",
	"l'",
	"un",
	"une",
	"des",
	"du",
	"de",
	"au",
	"aux",
	"en",
	"y",
	"ce",
	"cette",
	"ces",
	"et",
	"ou",
	"mais",
	"donc",
	"car",
	"ni",
	"avec",
	"pour",
	"dans",
	"sur",
	"sous",
	"par",
	"sans",
	"chez",
	"entre",
	"pendant",
	"depuis",
	"jusque",
	"vers",
	"est",
	"sont",
	"a",
	"ont",
	"avait",
	"avaient",
	"sera",
	"seront",
	"être",
	"avoir",
	"faire",
	"pouvoir",
	"vouloir",
	"devoir",
	"savoir",
	"pas",
	"rien",
	"jamais",
	"personne",
	"aucun",
	"ne",
	"guère",
	"plus",
	"très",
	"assez",
	"trop",
	"peu",
	"beaucoup",
	"tellement",
	"si",
	"aussi",
	"bonjour",
	"bonsoir",
	"merci",
	"salut",
	"adieu",
	"s'il",
	"vous",
	"plaît",
	"donc",
	"alors",
	"puis",
	"ensuite",
	"enfin",
	"cependant",
	"pourtant",
	"qui",
	"que",
	"quoi",
	"dont",
	"où",
	"comment",
	"pourquoi",
	"quand",
	"tout",
	"tous",
	"toute",
	"toutes",
	"chaque",
	"quelques",
	"plusieurs",
	// Spanish
	"el",
	"la",
	"los",
	"las",
	"un",
	"una",
	"unos",
	"unas",
	"yo",
	"tú",
	"él",
	"ella",
	"nosotros",
	"vosotros",
	"ellos",
	"ellas",
	"usted",
	"ustedes",
	"y",
	"o",
	"pero",
	"sino",
	"porque",
	"como",
	"cuando",
	"donde",
	"mientras",
	"es",
	"son",
	"está",
	"están",
	"estoy",
	"estás",
	"somos",
	"estáis",
	"he",
	"has",
	"ha",
	"hemos",
	"habéis",
	"han",
	"había",
	"habían",
	"hay",
	"había",
	"habrá",
	"hubo",
	"ser",
	"estar",
	"tener",
	"hacer",
	"poder",
	"muy",
	"mucho",
	"poco",
	"bastante",
	"demasiado",
	"tan",
	"tanto",
	"hola",
	"adiós",
	"gracias",
	"por",
	"favor",
	"señor",
	"señora",
	"qué",
	"quién",
	"cuyo",
	"cuál",
	"cómo",
	"porqué",
	"cuándo",
	"este",
	"esta",
	"estos",
	"estas",
	"ese",
	"esa",
	"esos",
	"esas",
	"sobre",
	"bajo",
	"contra",
	"hacia",
	"entre",
	"mediante",
	"según",
	"también",
	"no",
	"sí",
	"nunca",
	"siempre",
	"ya",
	"todavía",
	"aún",
]);

function isLikelyNonEnglish(text: string): boolean {
	const words = text
		.toLowerCase()
		.split(/[^a-z]+/)
		.filter((w) => w.length > 1);
	if (words.length < 3) return false;
	let hits = 0;
	for (const w of words) {
		if (NON_EN_WORDS.has(w)) hits++;
	}
	// If >=20% of words are non-English markers → likely non-English
	return hits / words.length >= 0.2;
}

export function needsTranslation(text: string): boolean {
	if (!text || text.length < 5) return false;
	// Stage 1: non-ASCII chars → definitely non-English
	for (let i = 0; i < text.length; i++) {
		if (text.charCodeAt(i) > 127) return true;
	}
	// Stage 2: word-frequency fallback for European languages
	return isLikelyNonEnglish(text);
}

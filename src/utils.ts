/**
 * Pure utility functions extracted from index.ts for testability.
 */

export function isMostlyEN(t: string): boolean {
	if (!t || t.length < 15) return false;
	let nonAscii = 0;
	for (let i = 0; i < t.length; i++) {
		if (t.charCodeAt(i) > 127) nonAscii++;
	}
	return nonAscii / t.length < 0.05;
}

export function hasCodeBlock(t: string): boolean {
	return /```[\s\S]*```/.test(t) || /`[^`]+`/.test(t);
}

export function extractTextBlocks(content: unknown): Array<{ idx: number; text: string }> {
	const blocks: Array<{ idx: number; text: string }> = [];
	if (!Array.isArray(content)) return blocks;
	for (let i = 0; i < content.length; i++) {
		const b = content[i];
		if (
			b &&
			typeof b === "object" &&
			"type" in b &&
			b.type === "text" &&
			typeof b.text === "string"
		) {
			blocks.push({ idx: i, text: b.text });
		}
	}
	return blocks;
}

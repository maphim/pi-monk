import assert from "node:assert";
import { describe, it } from "node:test";
import { extractTextBlocks, hasCodeBlock, isMostlyEN } from "../src/utils.ts";

describe("isMostlyEN", () => {
	it("returns true for ASCII text", () => {
		assert.ok(isMostlyEN("This is a normal English sentence"));
		assert.ok(isMostlyEN("Check the authentication module in the config file"));
	});

	it("returns false for short text (< 15 chars)", () => {
		assert.strictEqual(isMostlyEN("Hi"), false);
		assert.strictEqual(isMostlyEN("Hello world"), false);
	});

	it("returns false for empty text", () => {
		assert.strictEqual(isMostlyEN(""), false);
	});

	it("returns false for text with significant non-ASCII", () => {
		assert.strictEqual(isMostlyEN("Xin chào, tôi là lập trình viên"), false);
		assert.strictEqual(isMostlyEN("Français développeur système"), false);
	});

	it("returns true for text with minor non-ASCII (punctuation)", () => {
		// Emoji in surrogate pair counts as 2 non-ASCII → needs enough ASCII padding
		assert.ok(isMostlyEN("This works great! With padding text here. 🎉"));
	});
});

describe("hasCodeBlock", () => {
	it("returns true for fenced code blocks", () => {
		assert.ok(hasCodeBlock("Here is code:\n```\nconst x = 1;\n```"));
		assert.ok(hasCodeBlock("```typescript\nconst x: number = 1;\n```"));
	});

	it("returns true for inline code", () => {
		assert.ok(hasCodeBlock("Use the `foo()` function"));
		assert.ok(hasCodeBlock("Run `npm install` first"));
	});

	it("returns false for plain text", () => {
		assert.strictEqual(hasCodeBlock("This is plain text"), false);
		assert.strictEqual(hasCodeBlock("No code blocks or inline code here"), false);
	});

	it("handles multiple code blocks", () => {
		const text = "First:\n```\nconst a = 1;\n```\nThen:\n```\nconst b = 2;\n```";
		assert.ok(hasCodeBlock(text));
	});
});

describe("extractTextBlocks", () => {
	it("extracts text blocks from message content array", () => {
		const content = [
			{ type: "text", text: "Hello world" },
			{ type: "text", text: "Second message" },
		];
		const result = extractTextBlocks(content);
		assert.strictEqual(result.length, 2);
		assert.strictEqual(result[0].idx, 0);
		assert.strictEqual(result[0].text, "Hello world");
		assert.strictEqual(result[1].idx, 1);
		assert.strictEqual(result[1].text, "Second message");
	});

	it("skips tool call blocks", () => {
		const content = [
			{ type: "text", text: "Let me check" },
			{ type: "toolCall", name: "bash", arguments: { command: "ls" } },
			{ type: "text", text: "Here is the result" },
		];
		const result = extractTextBlocks(content);
		assert.strictEqual(result.length, 2);
		assert.strictEqual(result[0].text, "Let me check");
		assert.strictEqual(result[1].text, "Here is the result");
	});

	it("returns empty array for non-array input", () => {
		assert.deepStrictEqual(extractTextBlocks(null), []);
		assert.deepStrictEqual(extractTextBlocks(undefined), []);
		assert.deepStrictEqual(extractTextBlocks("string"), []);
		assert.deepStrictEqual(extractTextBlocks(42), []);
	});

	it("handles empty array", () => {
		assert.deepStrictEqual(extractTextBlocks([]), []);
	});

	it("skips blocks without text property", () => {
		const content = [
			{ type: "text", text: "Valid" },
			{ type: "text" },
			{ type: "image", source: "pic.png" },
		];
		const result = extractTextBlocks(content);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].text, "Valid");
	});
});

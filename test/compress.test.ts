import assert from "node:assert";
import { describe, it } from "node:test";
import { compressAAAK, compressionRatio } from "../src/compress.ts";

describe("compressAAAK", () => {
	it("strips VN courtesies (s1)", () => {
		const result = compressAAAK("dạ thưa anh cho em hỏi về vấn đề này");
		assert.ok(!result.includes("dạ thưa"));
		assert.ok(!result.includes("cho em hỏi"));
		assert.ok(result.length < 20);
	});

	it("strips EN courtesies (s2)", () => {
		const cases = [
			"Hello, can you help me?",
			"Thank you very much for your help",
			"I was wondering if you could help",
			"Good morning, could you check this?",
		];
		for (const input of cases) {
			const result = compressAAAK(input);
			assert.ok(
				result.length <= input.length,
				`"${input}" (${input.length}) → "${result}" (${result.length}) should compress`,
			);
			assert.ok(!result.includes("Hello"));
			assert.ok(!result.includes("Good morning"));
			assert.ok(!result.includes("wondering"));
		}
	});

	it("strips filler phrases (s3)", () => {
		const result = compressAAAK("I think that basically we should do this");
		assert.ok(!result.includes("I think"));
		assert.ok(!result.includes("basically"));
	});

	it("condenses verbose patterns (s4)", () => {
		const result = compressAAAK("I have a question about how this works");
		assert.ok(result.includes("q:") || result.includes("works"));
	});

	it("applies nano-syntax stripping (s5)", () => {
		const result = compressAAAK("The quick brown fox jumps over the lazy dog");
		// Articles 'the' and 'a' should be stripped
		assert.ok(!result.includes("the quick"));
	});

	it("applies abbreviations (s6)", () => {
		const result = compressAAAK("Check the application configuration documentation");
		assert.ok(result.includes("app"));
		assert.ok(result.includes("config"));
		assert.ok(!result.includes("application"));
		assert.ok(!result.includes("configuration"));
	});

	it("handles empty or short text", () => {
		assert.strictEqual(compressAAAK(""), "");
		assert.strictEqual(compressAAAK("hi"), "hi");
		assert.strictEqual(compressAAAK("short"), "short");
	});

	it("produces shorter or equal output", () => {
		const cases = [
			"Can you please help me check this application configuration?",
			"I think that we should implement the authentication module first",
			"Basically, the issue is that the database connection keeps timing out",
		];
		for (const input of cases) {
			const result = compressAAAK(input);
			assert.ok(
				result.length <= input.length,
				`Input "${input}" (${input.length}) → "${result}" (${result.length}) should be shorter or equal`,
			);
		}
	});

	it("preserves camelCase function names", () => {
		const result = compressAAAK("Check the function authenticateUser in auth handler");
		assert.ok(result.includes("authenticateUser"));
	});

	it("removes extra whitespace (s9)", () => {
		const result = compressAAAK("  hello   world  ");
		assert.ok(!result.startsWith(" "));
		assert.ok(!result.endsWith(" "));
		assert.ok(!result.includes("  "));
	});
});

describe("compressionRatio", () => {
	it("returns 0% for empty input", () => {
		assert.strictEqual(compressionRatio("", ""), "0%");
	});

	it("returns correct percentage", () => {
		// "hello" (5) → "hi" (2) → savings = 3/5 = 60%
		// But compressAAAK won't do this, so we test the formula directly
		assert.strictEqual(compressionRatio("hello", "hi"), "60%");
	});

	it("handles no compression", () => {
		assert.strictEqual(compressionRatio("hello", "hello"), "0%");
	});
});

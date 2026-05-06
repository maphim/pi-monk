import assert from "node:assert";
import { describe, it } from "node:test";
import { needsTranslation } from "../src/translate.ts";

describe("needsTranslation", () => {
	it("returns true for Vietnamese text (non-ASCII)", () => {
		const cases = [
			"Xin chào, tôi cần giúp đỡ về vấn đề này",
			"Cảm ơn bạn rất nhiều",
			"Làm ơn kiểm tra giúp tôi",
		];
		for (const input of cases) {
			assert.ok(needsTranslation(input), `Expected true for VN text: "${input}"`);
		}
	});

	it("returns true for German text (word-frequency)", () => {
		const cases = [
			"Können Sie mir bitte bei diesem Problem helfen?",
			"Ich möchte eine Frage zur Konfiguration stellen",
			"Vielen Dank für Ihre Hilfe",
		];
		for (const input of cases) {
			assert.ok(needsTranslation(input), `Expected true for DE text: "${input}"`);
		}
	});

	it("returns true for French text (word-frequency)", () => {
		const cases = [
			"Bonjour, pouvez-vous m'aider avec ce problème?",
			"Je voudrais poser une question",
			"Merci beaucoup pour votre aide",
		];
		for (const input of cases) {
			assert.ok(needsTranslation(input), `Expected true for FR text: "${input}"`);
		}
	});

	it("returns true for Spanish text (word-frequency)", () => {
		const cases = [
			"Hola, ¿puedes ayudarme con este problema?",
			"Muchas gracias por tu ayuda",
			"Quiero hacer una pregunta sobre la configuración",
		];
		for (const input of cases) {
			assert.ok(needsTranslation(input), `Expected true for ES text: "${input}"`);
		}
	});

	it("returns false for plain English text", () => {
		const cases = [
			"Can you help me with this issue?",
			"I need assistance with the configuration",
			"Please check the database connection",
		];
		for (const input of cases) {
			assert.ok(!needsTranslation(input), `Expected false for EN text: "${input}"`);
		}
	});

	it("returns false for empty or very short text", () => {
		assert.strictEqual(needsTranslation(""), false);
		assert.strictEqual(needsTranslation(" "), false);
		assert.strictEqual(needsTranslation("hi"), false);
		assert.strictEqual(needsTranslation("ok"), false);
	});

	it("returns false for text with < 3 words", () => {
		assert.strictEqual(needsTranslation("hello world"), false);
	});

	it("returns true for Russian/Cyrillic text", () => {
		assert.ok(needsTranslation("Привет, как дела?"));
	});

	it("returns true for Arabic text (non-ASCII)", () => {
		assert.ok(needsTranslation("مرحباً، كيف حالك؟"));
	});

	it("returns true for Chinese text (non-ASCII)", () => {
		assert.ok(needsTranslation("你好，请问这个怎么用？"));
	});
});

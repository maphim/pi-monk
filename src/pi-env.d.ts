// Ambient type declarations for pi.dev — LSP only. Runtime via jiti.
declare module "@mariozechner/pi-coding-agent" {
	export interface ExtensionAPI {
		on(event: string, handler: (...args: any[]) => any): void;
		registerTool(def: any): void;
		registerCommand(name: string, opts: any): void;
		registerShortcut(shortcut: string, opts: any): void;
		registerFlag(name: string, opts: any): void;
		sendMessage(msg: any, opts?: any): void;
		sendUserMessage(content: any, opts?: any): void;
		appendEntry(type: string, data?: any): void;
		setSessionName(name: string): void;
		getSessionName(): string | undefined;
		setLabel(entryId: string, label?: string): void;
		getCommands(): any[];
		registerMessageRenderer(customType: string, renderer: any): void;
		exec(cmd: string, args: string[], opts?: any): Promise<any>;
	}

	export interface ExtensionContext {
		ui: any;
		hasUI: boolean;
		cwd: string;
		sessionManager: any;
		modelRegistry: any;
		model: any;
		signal?: AbortSignal;
		isIdle(): boolean;
		abort(): void;
		hasPendingMessages(): boolean;
		shutdown(): void;
		getContextUsage(): any;
		compact(opts?: any): void;
		getSystemPrompt(): string;
	}

	export interface ExtensionCommandContext extends ExtensionContext {
		waitForIdle(): Promise<void>;
		newSession(opts?: any): Promise<any>;
		fork(entryId: string, opts?: any): Promise<any>;
		navigateTree(targetId: string, opts?: any): Promise<any>;
		switchSession(sessionPath: string, opts?: any): Promise<any>;
		reload(): Promise<void>;
	}

	export function isToolCallEventType<T extends string>(name: T, event: any): event is any;
	export function isBashToolResult(event: any): boolean;
	export function createLocalBashOperations(): any;
	export class DynamicBorder {
		constructor(fn: (s: string) => string);
	}
	export function getMarkdownTheme(): any;
}

declare module "@mariozechner/pi-ai" {
	export function complete(model: any, opts: any, auth?: any): Promise<any>;
	export function getModel(provider: string, modelId: string): any;
	export function StringEnum<T extends readonly string[]>(values: T): any;
}

import { createHash, randomUUID } from "node:crypto";
import z from "@deepseek-ai/schemastery";
import { z as z$1 } from "zod";
import { BlockAssembler, ReasoningEffortId, isAgentLoopRequest } from "@deepseek-ai/dsh-llm";
import { appendPluginRecord } from "@deepseek-ai/dsh-session";
import { LOCALE_SETTINGS_NAMESPACE } from "@deepseek-ai/dsh-client-locale";
import { defineDomain, domainTable } from "@deepseek-ai/dsh-storage-domain";
import { clientRequestSchema, transportError } from "@deepseek-ai/dsh-client-connection";
//#region src/records.ts
/** Versioned, ignorable task-tree records; none are part of the model conversation. */
/** How the auxiliary request is built. */
const GENERATION_MODES = [
	"fork",
	"fork-cheap",
	"checkpoint"
];
z$1.object({
	provider: z$1.string().min(1),
	model: z$1.string().min(1),
	reasoningEffort: z$1.string().min(1).optional()
}).strict();
const itemTitle = z$1.string().trim().min(1).max(120);
/** Answer validated from model JSON before normalization. */
const modelAnswerSchema = z$1.object({
	path: z$1.array(itemTitle).min(1),
	detail: z$1.string().trim().min(1).max(400),
	decisions: z$1.array(z$1.string().trim().min(1).max(400)).default([])
});
/** Persisted successful report fields consumed by the tree, the Client, and the index. */
const resultSchema = z$1.object({
	version: z$1.literal(1),
	id: z$1.string().min(1),
	sessionId: z$1.string().min(1),
	mode: z$1.enum(GENERATION_MODES),
	/** Session seq of the last event visible to the captured context. */
	contextSeq: z$1.number().int().nonnegative(),
	coveredStepCount: z$1.number().int().nonnegative(),
	/** Turn and step current when the context was captured; named to stay out of Conversation coordinates. */
	coveredTurn: z$1.number().int().nonnegative().optional(),
	coveredStep: z$1.number().int().nonnegative().optional(),
	path: z$1.array(z$1.string().min(1)).min(1),
	previousPath: z$1.array(z$1.string().min(1)),
	detail: z$1.string().min(1),
	decisions: z$1.array(z$1.string().min(1))
});
/** Rolling summary of the captured messages before a boundary. */
const checkpointSchema = z$1.object({
	version: z$1.literal(1),
	id: z$1.string().min(1),
	sessionId: z$1.string().min(1),
	/** Number of leading captured messages the summary replaces. */
	boundary: z$1.number().int().positive(),
	/** SHA-256 of the canonical JSON of the summarized messages. */
	prefixHash: z$1.string().regex(/^[0-9a-f]{64}$/u),
	summary: z$1.string().min(1),
	basedOn: z$1.string().min(1).optional()
});
/** Title written by this plugin, so a later rename can tell it from a user's title. */
const titleSchema = z$1.object({
	version: z$1.literal(1),
	title: z$1.string().min(1)
});
/** Record type names. */
const RECORD = {
	request: "plugin:task-tree/request",
	result: "plugin:task-tree/result",
	failure: "plugin:task-tree/failure",
	checkpoint: "plugin:task-tree/checkpoint",
	title: "plugin:task-tree/title"
};
/**
* Read an untrusted result record without importing the Host Session runtime.
* @param event - event envelope.
* @returns validated result data, or undefined for any other or malformed event.
*/
function readResult(event) {
	if (event.type !== RECORD.result || event.ignorable !== true) return void 0;
	const parsed = resultSchema.safeParse(event.data);
	return parsed.success ? parsed.data : void 0;
}
/**
* Read an untrusted checkpoint record.
* @param event - event envelope.
* @returns validated checkpoint data, or undefined.
*/
function readCheckpoint(event) {
	if (event.type !== RECORD.checkpoint || event.ignorable !== true) return void 0;
	const parsed = checkpointSchema.safeParse(event.data);
	return parsed.success ? parsed.data : void 0;
}
/**
* Read an untrusted title marker.
* @param event - event envelope.
* @returns validated title, or undefined.
*/
function readTitle(event) {
	if (event.type !== RECORD.title || event.ignorable !== true) return void 0;
	const parsed = titleSchema.safeParse(event.data);
	return parsed.success ? parsed.data.title : void 0;
}
/**
* Whether two task paths name the same items.
* @param a - first path.
* @param b - second path.
* @returns true when every segment is equal.
*/
function samePath(a, b) {
	return a.length === b.length && a.every((segment, index) => segment === b[index]);
}
//#endregion
//#region src/tree.ts
/**
* Stable identity of the item named by a path prefix.
* @param path - task path.
* @param depth - zero-based depth of the item.
* @returns the identity string.
*/
function nodeKey(path, depth) {
	return JSON.stringify(path.slice(0, depth + 1));
}
function keysOf(path) {
	return path.map((_, depth) => nodeKey(path, depth));
}
/**
* Fold reports into a tree. Every report contributes structure; only reports up to the cutoff set statuses.
* @param records - successful reports in log order.
* @param options - cutoff and settlement; a number is accepted as the cutoff.
* @returns the derived tree.
*/
function buildTree(records, options = {}) {
	const { cutoffSeq, settled = false } = typeof options === "number" ? { cutoffSeq: options } : options;
	const byKey = /* @__PURE__ */ new Map();
	const roots = [];
	for (const record of records) {
		const keys = keysOf(record.path);
		keys.forEach((key, depth) => {
			if (byKey.has(key)) return;
			const parentKey = depth === 0 ? void 0 : keys[depth - 1];
			const node = {
				key,
				title: record.path[depth],
				depth,
				parentKey,
				children: [],
				status: "pending",
				firstRecordId: record.id,
				firstSeq: record.seq,
				firstContextSeq: record.contextSeq,
				firstTurn: record.coveredTurn,
				lastSeq: void 0,
				completedSeq: void 0,
				decisions: [],
				detail: void 0
			};
			byKey.set(key, node);
			const parent = parentKey === void 0 ? void 0 : byKey.get(parentKey);
			if (parent === void 0) roots.push(node);
			else parent.children.push(node);
		});
	}
	const seen = /* @__PURE__ */ new Set();
	let onPath = /* @__PURE__ */ new Set();
	let latest;
	let included = 0;
	for (const record of records) {
		if (cutoffSeq !== void 0 && record.seq > cutoffSeq) continue;
		included++;
		latest = record;
		const keys = keysOf(record.path);
		const next = new Set(keys);
		for (const key of onPath) {
			const node = byKey.get(key);
			if (node !== void 0 && !next.has(key)) node.completedSeq = record.seq;
		}
		for (const key of keys) {
			const node = byKey.get(key);
			seen.add(key);
			node.lastSeq = record.seq;
			node.completedSeq = void 0;
		}
		const deepest = byKey.get(keys[keys.length - 1]);
		deepest.detail = record.detail;
		for (const text of record.decisions) deepest.decisions.push({
			text,
			recordId: record.id
		});
		onPath = next;
	}
	const focus = latest ?? (cutoffSeq !== void 0 ? records[0] : void 0);
	const activeKeys = focus === void 0 ? [] : keysOf(focus.path);
	const activeKey = latest === void 0 || settled ? void 0 : activeKeys[activeKeys.length - 1];
	let doneCount = 0;
	for (const node of byKey.values()) {
		if (!seen.has(node.key)) node.status = "pending";
		else if (onPath.has(node.key) && !settled) node.status = node.key === activeKey ? "active" : "current";
		else {
			node.status = "done";
			if (onPath.has(node.key)) node.completedSeq = latest?.seq;
		}
		if (node.status === "done") doneCount++;
	}
	return {
		roots,
		byKey,
		activeKeys,
		activeKey,
		latest,
		included,
		doneCount,
		totalCount: byKey.size
	};
}
/**
* Indented outline the side query receives as the existing tree.
* Lists every top-level item and every sibling along the current branch;
* the oldest done siblings collapse into a count when the outline exceeds `maxItems`.
* @param tree - derived tree.
* @param maxItems - maximum listed items.
* @returns plain-text outline, or an empty string without records.
*/
function outlineForPrompt(tree, maxItems) {
	if (tree.latest === void 0) return "";
	const levels = [tree.roots];
	for (const key of tree.activeKeys.slice(0, -1)) {
		const node = tree.byKey.get(key);
		if (node !== void 0 && node.children.length > 0) levels.push(node.children);
	}
	const collapsed = levels.map(() => 0);
	const total = () => levels.reduce((sum, level, index) => sum + level.length - collapsed[index], 0);
	const collapsible = (index) => {
		const node = levels[index][collapsed[index]];
		return node !== void 0 && node.status === "done" ? 1 : 0;
	};
	while (total() > maxItems) {
		let best = -1;
		let bestSize = 0;
		levels.forEach((level, index) => {
			const remaining = level.length - collapsed[index];
			if (collapsible(index) > 0 && remaining > bestSize) {
				best = index;
				bestSize = remaining;
			}
		});
		if (best < 0) break;
		collapsed[best] = collapsed[best] + 1;
	}
	const lines = [];
	const write = (level, depth) => {
		const nodes = levels[level];
		const skip = collapsed[level];
		const indent = "  ".repeat(depth);
		if (skip > 0) lines.push(`${indent}- (+${skip} earlier done items)`);
		for (const node of nodes.slice(skip)) {
			lines.push(`${indent}- [${node.status}] ${node.title}`);
			for (const decision of node.decisions.slice(-3)) lines.push(`${indent}    decision: ${decision.text}`);
			if (node.status === "active" && node.detail !== void 0) lines.push(`${indent}    detail: ${node.detail}`);
			if (node.status !== "done" && level + 1 < levels.length && levels[level + 1]?.[0]?.parentKey === node.key) write(level + 1, depth + 1);
		}
	};
	write(0, 0);
	return lines.join("\n");
}
/**
* Every decision already present in the tree, for deduplication.
* @param tree - derived tree.
* @returns normalized decision texts.
*/
function knownDecisions(tree) {
	const known = /* @__PURE__ */ new Set();
	for (const node of tree.byKey.values()) for (const decision of node.decisions) known.add(normalizeText(decision.text));
	return known;
}
/**
* Case- and whitespace-insensitive comparison form.
* @param text - free text.
* @returns normalized text.
*/
function normalizeText(text) {
	return text.trim().replace(/\s+/gu, " ").toLowerCase();
}
/** Punctuation, symbols, and whitespace that a retyped title may swap for one another. */
const IDENTITY_NOISE = /[\p{P}\p{S}\s]+/gu;
/**
* Separator-insensitive identity form of an item title. Two titles with the same form name the same item,
* so a report that retypes `KernelSU/LSPosed` as `KernelSU-LSPosed` keeps the existing item instead of
* forking a second one under a variant spelling.
* @param text - item title.
* @returns the identity form, empty when the title carries no letters or digits.
*/
function identityText(text) {
	return text.normalize("NFKC").toLowerCase().replace(IDENTITY_NOISE, "");
}
/**
* Most recently active item of one level, in creation order for equal recency.
* @param nodes - siblings at one level.
* @returns the latest sibling, or undefined for an empty level.
*/
function latestSibling(nodes) {
	let latest;
	for (const node of nodes) {
		const seen = node.lastSeq ?? node.firstSeq;
		if (latest === void 0 || seen >= (latest.lastSeq ?? latest.firstSeq)) latest = node;
	}
	return latest;
}
/**
* Map a reported path onto established item titles. {@link LATEST_ITEM_ALIAS} stands for the item the
* previous report named at that level, or the most recently active sibling of that level when the report
* moves to another branch, so the model never has to retype a long title. Any other item reuses an
* established sibling with the same {@link identityText}, which keeps one item when a separator is retyped.
* @param path - reported items, outermost first.
* @param tree - tree derived from the preceding reports.
* @returns resolved titles, or the first level whose alias has no established item.
*/
function resolveReportedPath(path, tree) {
	const previous = tree.latest?.path ?? [];
	const resolved = [];
	let followsPrevious = previous.length > 0;
	for (const [depth, candidate] of path.entries()) {
		const parentKey = depth === 0 ? void 0 : nodeKey(resolved, depth - 1);
		const siblings = parentKey === void 0 ? tree.roots : tree.byKey.get(parentKey)?.children ?? [];
		const established = followsPrevious && previous[depth] !== void 0 ? siblings.find((node) => node.title === previous[depth]) : void 0;
		const named = candidate === "@" ? established?.title ?? latestSibling(siblings)?.title : candidate;
		if (named === void 0) return {
			kind: "unresolved-alias",
			depth
		};
		const identity = identityText(named);
		const title = (identity === "" ? void 0 : siblings.find((node) => node.title !== named && identityText(node.title) === identity))?.title ?? named;
		followsPrevious = followsPrevious && title === previous[depth];
		resolved.push(title);
	}
	return {
		kind: "resolved",
		path: resolved
	};
}
//#endregion
//#region src/projection.ts
/** Session projection of task-tree reports, cadence counters, checkpoints, and plugin-written titles. */
const treeRecordSchema = z$1.object({
	id: z$1.string(),
	seq: z$1.number().int().nonnegative(),
	contextSeq: z$1.number().int().nonnegative(),
	coveredTurn: z$1.number().int().nonnegative().optional(),
	mode: z$1.enum(GENERATION_MODES),
	path: z$1.array(z$1.string()),
	previousPath: z$1.array(z$1.string()),
	detail: z$1.string(),
	decisions: z$1.array(z$1.string())
});
const viewSchema = z$1.object({ records: z$1.array(treeRecordSchema) });
const stateSchema = z$1.object({
	sessionId: z$1.string(),
	inherited: z$1.number().int().nonnegative(),
	turn: z$1.number().int().nonnegative().optional(),
	step: z$1.number().int().nonnegative().optional(),
	stepCount: z$1.number().int().nonnegative(),
	covered: z$1.number().int().nonnegative(),
	view: viewSchema,
	checkpoint: z$1.object({
		id: z$1.string(),
		boundary: z$1.number().int().positive(),
		prefixHash: z$1.string(),
		summary: z$1.string()
	}).optional(),
	lastTitle: z$1.string().optional()
});
/**
* Fold one committed event.
* @param state - previous state.
* @param event - committed event.
* @returns next state, the same reference for unrelated events.
*/
function applyTaskTree(state, event) {
	if (event.type === "step/start") return {
		...state,
		turn: event.data.turn,
		step: event.data.step
	};
	if (event.type === "step/end") return event.seq < state.inherited ? state : {
		...state,
		stepCount: state.stepCount + 1
	};
	const result = readResult(event);
	if (result !== void 0) {
		const record = {
			id: result.id,
			seq: event.seq,
			contextSeq: result.contextSeq,
			mode: result.mode,
			...result.coveredTurn === void 0 ? {} : { coveredTurn: result.coveredTurn },
			path: result.path,
			previousPath: result.previousPath,
			detail: result.detail,
			decisions: result.decisions
		};
		const own = result.sessionId === state.sessionId && event.seq >= state.inherited;
		return {
			...state,
			view: { records: [...state.view.records, record] },
			covered: own ? Math.max(state.covered, Math.min(state.stepCount, result.coveredStepCount)) : state.covered
		};
	}
	const checkpoint = readCheckpoint(event);
	if (checkpoint !== void 0) return {
		...state,
		checkpoint: {
			id: checkpoint.id,
			boundary: checkpoint.boundary,
			prefixHash: checkpoint.prefixHash,
			summary: checkpoint.summary
		}
	};
	const title = readTitle(event);
	if (title !== void 0) return {
		...state,
		lastTitle: title
	};
	return state;
}
/** Client-visible `taskTree` unit; the view keeps its reference until a report lands. */
const taskTreeProjection = {
	key: "taskTree",
	stateVersion: 1,
	stateSchema,
	init: (header, inherited) => ({
		sessionId: header.id,
		inherited,
		stepCount: 0,
		covered: 0,
		view: { records: [] }
	}),
	apply: applyTaskTree,
	wire: {
		viewSchema,
		view: (state) => state.view,
		summary: false
	}
};
//#endregion
//#region src/prompt.ts
/** Model-facing instructions of the task-tree side queries; English text with a dynamic output language. */
const REPORT_INSTRUCTION = `Report what the agent in this conversation is working on, for a task tree that grows from what is being done and has been done. The main task continues independently: do not execute it, call tools, ask questions, or plan future work.

Return only valid JSON with exactly these keys, without extra text or code fences:
{"path":["{top-level task}","{subtask}","{current item}"],"detail":"{current action within the current item}","decisions":[]}

"path": the hierarchy from the overall task down to the item being worked on right now, 1 to {maxDepth} levels. Name items by the work they represent, as short noun or verb phrases (no trailing punctuation). When an item of the existing tree below still describes the work, repeat its title verbatim and keep its ancestors; when the agent has moved on, report the item it is working on now. Write @ instead of repeating an established title: @ at a level stands for the item the previous report named there, or for the most recently active item of that level when you move to another branch. For example ["@","@","{new child}"] keeps both ancestors and opens a new child under the second one. Spell a title out only when it is new; when you do repeat an established one, copy it character for character, because its exact text is the item's identity and a retyped separator creates a second item beside the original. Add a new item only for work that has actually started, under the ancestor it belongs to, at a level of detail similar to its siblings. Never list future or planned items.

"detail": one short present-tense sentence (at most 30 words, or 60 CJK characters) about only what is happening inside the last path item now: the concrete action and its state, for example "Installing the vendor packages with Yarn; installation is running." It must not recap finished steps or mention work outside that item or next steps.

"decisions": design decisions the agent made on its own since the previous report, each one short sentence stating the choice (not the rationale). Exclude choices the user specified, routine operations, plans not yet acted on, and decisions already listed in the existing tree. Use [] when there are none; that is normal.

Use filenames or identifiers only when needed for orientation. Distinguish verified results from attempts; invent nothing.`;
const RETRY_INSTRUCTION = "The previous response was not valid JSON matching every requirement above. Regenerate it.";
const REPORTER_SYSTEM = "You report the progress of a software agent from a summary and a transcript of its conversation. You never act on the task yourself.";
const SUMMARY_INSTRUCTION = `Write a rolling summary of the agent conversation below for a reader who will not see it. Merge it with the previous summary when one is given, producing one self-contained summary.

Keep: the user's goals and constraints; the hierarchy of work carried out so far and what was completed, verified, or abandoned; design decisions the agent made and who made them; files and components involved; open threads and the work in progress at the end. Drop tool output details, retries, and chatter. Prefer short structured bullet lists. Do not add commentary or plans the agent did not state. Return only the summary text.`;
/**
* Describe the output language from the DSH locale selection.
* @param locale - explicit DSH locale selection; absence keeps the conversation's language.
* @returns one instruction sentence.
*/
function languageLine(locale) {
	return locale === void 0 ? "Write titles, detail, and decisions in the user's language from the conversation." : `Write titles, detail, and decisions in the DSH output language ${JSON.stringify(locale)} (BCP 47), overriding the conversation and examples; keep repeated existing titles verbatim.`;
}
/**
* Build the report question appended after the reported context.
* @param input - tree outline, depth limit, language, and retry state.
* @returns the complete user message text.
*/
function createQuestion(input) {
	const tree = input.outline === "" ? "Existing tree: none yet; this is the first report." : `Existing tree ([active] is the item of the previous report, [current] its ancestors, [done] finished items):\n${input.outline}`;
	return [
		"<system>",
		REPORT_INSTRUCTION.replace("{maxDepth}", String(input.maxDepth)),
		"",
		tree,
		"",
		languageLine(input.locale),
		...input.retry ? ["", RETRY_INSTRUCTION] : [],
		"</system>"
	].join("\n");
}
/**
* System prompt of a checkpoint-mode report.
* @returns fixed reporter system text.
*/
function reporterSystem() {
	return REPORTER_SYSTEM;
}
/**
* Build one checkpoint summarization input.
* @param previous - summary of everything before `transcript`, when one exists.
* @param transcript - rendered conversation segment to fold in.
* @returns the complete user message text.
*/
function createSummaryInput(previous, transcript) {
	return [
		SUMMARY_INSTRUCTION,
		"",
		previous === void 0 ? "<previous_summary>none</previous_summary>" : `<previous_summary>\n${previous}\n</previous_summary>`,
		"",
		`<conversation>\n${transcript}\n</conversation>`
	].join("\n");
}
/**
* Build the leading, append-only part of a checkpoint-mode report input.
* @param summary - rolling summary before the boundary, when a checkpoint exists.
* @param transcript - rendered messages after the boundary.
* @returns text that changes only by appending until the next checkpoint.
*/
function checkpointContext(summary, transcript) {
	return [summary === void 0 ? "" : `<summary_of_earlier_conversation>\n${summary}\n</summary_of_earlier_conversation>\n\n`, `<conversation>\n${transcript}`].join("");
}
//#endregion
//#region src/generate/call.ts
/** Failure carrying the stage it happened in. */
var CallError = class extends Error {
	stage;
	retryable;
	/**
	* @param stage - operation that failed.
	* @param message - failure description.
	* @param retryable - whether another attempt may succeed with the same input.
	*/
	constructor(stage, message, retryable = false) {
		super(message);
		this.stage = stage;
		this.retryable = retryable;
	}
};
/**
* Prepare and stream one call, rejecting tool calls and oversized output.
* @param ctx - context exposing the LLM service.
* @param draft - request whose call config is proposed by its provider, model, and controls.
* @param maxResponseBytes - limit on the serialized size of received chunks.
* @param signal - cancellation.
* @param hooks - optional dispatch hooks.
* @returns the assembled text answer.
* @throws {CallError} with the failed stage.
*/
async function callText(ctx, draft, maxResponseBytes, signal, hooks = {}) {
	let request;
	let prepared;
	try {
		const config = {
			provider: draft.provider,
			model: draft.model,
			...draft.reasoningEffort === void 0 ? {} : { reasoningEffort: draft.reasoningEffort },
			...draft.temperature === void 0 ? {} : { temperature: draft.temperature },
			...draft.maxTokens === void 0 ? {} : { maxTokens: draft.maxTokens },
			...draft.stop === void 0 ? {} : { stop: draft.stop }
		};
		prepared = await ctx.llm.prepareCall(config, signal);
		request = {
			...draft,
			...prepared.config
		};
	} catch (error) {
		if (signal.aborted) throw signal.reason;
		throw new CallError("prepare", error instanceof Error ? error.message : String(error));
	}
	signal.throwIfAborted();
	const route = {
		provider: request.provider,
		model: request.model,
		...request.reasoningEffort === void 0 ? {} : { reasoningEffort: request.reasoningEffort }
	};
	try {
		await hooks.beforeDispatch?.(request, route);
	} catch (error) {
		throw new CallError("request", error instanceof Error ? error.message : String(error));
	}
	signal.throwIfAborted();
	const assembler = new BlockAssembler();
	let bytes = 0;
	let finished = false;
	for await (const chunk of prepared.stream({
		...request,
		purpose: "task-tree",
		signal
	})) {
		signal.throwIfAborted();
		bytes += Buffer.byteLength(JSON.stringify(chunk), "utf8");
		if (bytes > maxResponseBytes) throw new CallError("response", "response exceeded maxResponseBytes");
		if (chunk.type === "tool-call-delta" || chunk.type === "block-start" && chunk.blockType === "tool-call") throw new CallError("parse", "the model attempted a tool call", true);
		assembler.push(chunk);
		if (chunk.type === "finish") finished = true;
	}
	signal.throwIfAborted();
	if (!finished || assembler.finish.kind !== "stop") {
		const finish = assembler.finish;
		throw new CallError("response", `the call did not finish normally (${finish.kind === "error" || finish.kind === "aborted" ? `${finish.kind}: ${finish.failure.message}` : finish.kind})`, finish.kind === "max-tokens");
	}
	const blocks = assembler.blocks();
	return {
		text: blocks.filter((block) => block.type === "text").map((block) => block.text).join(""),
		blocks,
		usage: assembler.usage,
		route,
		request
	};
}
/**
* Extract a JSON value from model text that may be wrapped in a code fence.
* @param text - model answer.
* @returns parsed JSON.
* @throws {CallError} parse-stage failure when the text is not JSON.
*/
function parseJsonAnswer(text) {
	const trimmed = text.trim().replace(/^```(?:json)?\s*\n/u, "").replace(/\n?```\s*$/u, "");
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");
	try {
		return JSON.parse(start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed);
	} catch (error) {
		throw new CallError("parse", `invalid JSON: ${error instanceof Error ? error.message : String(error)}`, true);
	}
}
//#endregion
//#region src/generate/request.ts
/** Request construction for the three generation modes. */
/**
* Proposed call fields for an explicitly configured route; sampling controls use the route's defaults.
* @param route - configured provider route.
* @returns provider, model, and optional reasoning effort.
*/
function routeFields(route) {
	return {
		provider: route.provider,
		model: route.model,
		...route.reasoningEffort === void 0 ? {} : { reasoningEffort: ReasoningEffortId(route.reasoningEffort) }
	};
}
function userText(text) {
	return {
		role: "user",
		content: [{
			type: "text",
			text
		}]
	};
}
/**
* Reuse the captured agent-loop request and append one question.
* @param captured - agent-loop request captured from `llm/stream`.
* @param question - report question.
* @param route - replacement route; absent keeps the agent's route and controls.
* @returns the draft request.
*/
function forkRequest(captured, question, route) {
	const messages = [...captured.messages, userText(question)];
	if (route === void 0) return {
		...captured,
		messages
	};
	const { temperature: _temperature, maxTokens: _maxTokens, stop: _stop, reasoningEffort: _effort, ...rest } = captured;
	return {
		...rest,
		...routeFields(route),
		messages
	};
}
/**
* Build a checkpoint-mode report request whose leading text grows only by appending until the next checkpoint.
* @param route - configured cheap route.
* @param summary - rolling summary before the boundary.
* @param transcript - rendered messages after the boundary.
* @param question - report question.
* @param sessionId - Session the report belongs to.
* @returns the draft request.
*/
function checkpointRequest(route, summary, transcript, question, sessionId) {
	return {
		...routeFields(route),
		system: reporterSystem(),
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: checkpointContext(summary, transcript)
			}, {
				type: "text",
				text: `\n</conversation>\n\n${question}`
			}]
		}],
		...sessionId === void 0 ? {} : { sessionId }
	};
}
/**
* Text of a checkpoint-mode request input, recorded with the request.
* @param request - draft built by {@link checkpointRequest}.
* @returns concatenated user text.
*/
function requestInput(request) {
	const last = request.messages[request.messages.length - 1];
	return last === void 0 ? "" : last.content.map((block) => block.type === "text" ? block.text : "").join("");
}
/**
* Plain summarization request.
* @param route - configured cheap route.
* @param input - summarization input.
* @param maxTokens - output token cap.
* @param sessionId - Session the summary belongs to.
* @returns the draft request.
*/
function summaryRequest(route, input, maxTokens, sessionId) {
	return {
		...routeFields(route),
		system: reporterSystem(),
		maxTokens,
		messages: [userText(input)],
		...sessionId === void 0 ? {} : { sessionId }
	};
}
//#endregion
//#region src/generate/transcript.ts
/** Deterministic text rendering of captured agent-loop messages for checkpoint-mode requests. */
function clip(text, max) {
	return text.length <= max ? text : `${text.slice(0, max)}…[truncated ${text.length - max} chars]`;
}
/**
* Render a message range as plain text. System and developer messages, reasoning, and binary content are omitted
* or replaced by markers, so the text grows only by appending as the conversation grows.
* @param messages - complete captured request messages.
* @param start - first rendered index.
* @param end - exclusive end index.
* @param options - rendering limits.
* @returns rendered text; empty when the range renders nothing.
*/
function renderTranscript(messages, start, end, options) {
	return renderMessages(messages, start, end, options).join("");
}
/**
* Render each message of a range separately.
* @param messages - complete captured request messages.
* @param start - first rendered index.
* @param end - exclusive end index.
* @param options - rendering limits.
* @returns one string per message in the range; empty strings for omitted messages.
*/
function renderMessages(messages, start, end, options) {
	const toolNames = /* @__PURE__ */ new Map();
	for (const message of messages.slice(0, end)) {
		if (message.role !== "assistant") continue;
		for (const block of message.content) if (block.type === "tool-call") toolNames.set(block.id, block.name);
	}
	const rendered = [];
	for (let index = start; index < end; index++) {
		const message = messages[index];
		if (message === void 0) continue;
		const parts = [];
		for (const block of message.content) switch (block.type) {
			case "text":
				parts.push(block.text);
				break;
			case "tool-call":
				parts.push(`[call ${block.name} ${clip(block.arguments, options.toolResultMaxChars)}]`);
				break;
			case "image":
				parts.push("[image]");
				break;
			case "file":
				parts.push("[file]");
				break;
			default: break;
		}
		const body = parts.join("\n").trim();
		switch (message.role) {
			case "user":
				rendered.push(body === "" ? "" : `\n## User\n${body}\n`);
				break;
			case "assistant":
				rendered.push(body === "" ? "" : `\n## Assistant\n${body}\n`);
				break;
			case "tool": {
				const name = toolNames.get(message.toolCallId) ?? "tool";
				rendered.push(`\n## Result of ${name}${message.isError === true ? " (error)" : ""}\n${clip(body, options.toolResultMaxChars)}\n`);
				break;
			}
			default: rendered.push("");
		}
	}
	return rendered;
}
/**
* Largest boundary at or below `target` that does not separate a tool call from its result.
* A boundary index is valid when the message at it is a user or assistant message.
* @param messages - captured request messages.
* @param target - preferred boundary.
* @param minimum - smallest acceptable boundary.
* @returns a valid boundary, or undefined when none lies in `(minimum, target]`.
*/
function snapBoundary(messages, target, minimum) {
	for (let index = Math.min(target, messages.length - 1); index > minimum; index--) {
		const role = messages[index]?.role;
		if (role === "user" || role === "assistant") return index;
	}
}
/**
* Hash of the model-visible content before a boundary.
* @param messages - captured request messages.
* @param boundary - exclusive end.
* @returns lowercase hex SHA-256.
*/
function prefixHash(messages, boundary) {
	const hash = createHash("sha256");
	for (const message of messages.slice(0, boundary)) {
		hash.update(JSON.stringify([
			message.role,
			message.content,
			"toolCallId" in message ? message.toolCallId : null
		]));
		hash.update("\n");
	}
	return hash.digest("hex");
}
/**
* Group a message range into chunks whose rendered text stays within a character budget.
* A single message larger than the budget forms its own chunk, clipped to the budget.
* @param messages - captured request messages.
* @param start - first index.
* @param end - exclusive end.
* @param maxChars - chunk character budget.
* @param options - rendering limits.
* @returns rendered chunks in order.
*/
function chunkTranscript(messages, start, end, maxChars, options) {
	const chunks = [];
	let current = "";
	for (const text of renderMessages(messages, start, end, options)) {
		if (text === "") continue;
		if (current !== "" && current.length + text.length > maxChars) {
			chunks.push(current);
			current = "";
		}
		current += clip(text, maxChars);
	}
	if (current !== "") chunks.push(current);
	return chunks;
}
//#endregion
//#region src/generate/checkpoint.ts
/**
* Decide whether the current checkpoint still describes the captured messages and whether to move it.
* A checkpoint whose summarized prefix no longer matches (after the agent's own compaction, a fork, or a
* resume) is discarded, and the summary is rebuilt from the first message.
* @param messages - captured agent-loop messages.
* @param current - latest checkpoint, when one exists.
* @param config - cadence.
* @returns the plan.
*/
function planCheckpoint(messages, current, config) {
	const base = current !== void 0 && current.boundary < messages.length && prefixHash(messages, current.boundary) === current.prefixHash ? current : void 0;
	const from = base?.boundary ?? 0;
	if (messages.length - from <= config.everyMessages) return {
		kind: "use",
		checkpoint: base
	};
	const boundary = snapBoundary(messages, messages.length - config.keepMessages, from);
	if (boundary === void 0) return {
		kind: "use",
		checkpoint: base
	};
	return {
		kind: "advance",
		base,
		from,
		boundary
	};
}
//#endregion
//#region src/title.ts
/**
* Whether the plugin may replace the current title.
* A title the user set explicitly stays unless it equals the title this plugin wrote last,
* because the title service records the plugin's own renames as user renames too.
* @param current - current title snapshot.
* @param lastPluginTitle - latest title this plugin wrote to the Session.
* @param next - candidate title.
* @returns true when the rename should happen.
*/
function mayReplaceTitle(current, lastPluginTitle, next) {
	if (current === void 0) return true;
	if (current.title === next) return false;
	if (current.source.kind !== "user") return true;
	return lastPluginTitle !== void 0 && current.title === lastPluginTitle;
}
//#endregion
//#region src/protocol.ts
/** Validated messages on the plugin's authenticated Connection RPC routes. */
/** Connection owns authentication, correlation, transport, and cancellation. */
const TASK_TREE_CHANNEL = "/api";
/** Cross-session task list. */
const LIST_METHOD = "task-tree/list";
/** Untrusted browser input of the list method. */
const listRequestSchema = z$1.object({}).strict();
const rowSchema$1 = z$1.object({
	sessionId: z$1.string().min(1),
	rootTitle: z$1.string(),
	path: z$1.array(z$1.string()),
	detail: z$1.string(),
	doneCount: z$1.number().int().nonnegative(),
	totalCount: z$1.number().int().nonnegative(),
	lastRecordSeq: z$1.number().int().nonnegative(),
	updatedAt: z$1.number().nonnegative()
});
/** Stored and transmitted cross-session row. */
const taskIndexRowSchema = rowSchema$1;
z$1.object({
	rows: z$1.array(rowSchema$1),
	pollIntervalMs: z$1.number().int().positive()
});
/** Storage domain holding one row per Session that produced a report. */
const taskIndexSpec = defineDomain({
	name: "task_tree",
	version: 1,
	layout: "per-record",
	invalidRecords: "backup-and-skip",
	tables: { sessions: domainTable(taskIndexRowSchema) }
});
//#endregion
//#region src/rpc.ts
/**
* Register owner-only routes.
* @param ctx - context exposing `connection`.
* @param handler - endpoint handler.
*/
function registerTaskTreeRpc(ctx, handler) {
	for (const endpoint of [LIST_METHOD]) ctx.connection.fetch.register({
		path: `${TASK_TREE_CHANNEL}/${endpoint}`,
		methods: ["POST"],
		requestBody: "buffered",
		fetch: async (request) => {
			if (request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() !== "application/json") return new Response(null, { status: 415 });
			let body;
			try {
				body = await request.json();
			} catch (_error) {
				return new Response(null, { status: 400 });
			}
			const parsed = clientRequestSchema.safeParse(body);
			if (!parsed.success || parsed.data.method !== endpoint) return new Response(null, { status: 400 });
			const result = await handler(endpoint, parsed.data.payload, request.signal, ctx.connection.browserPeer).catch(transportError);
			return Response.json({
				type: "server-response",
				rpcId: parsed.data.rpcId,
				result
			});
		}
	});
}
//#endregion
//#region src/index.ts
/**
* Task-tree Host plugin: periodically asks a side model call what a running agent is working on, records each
* answer as an ignorable Session record, and serves a cross-session index of the latest answers.
*/
const positive = () => z.number().min(1).step(1);
/** Validated configuration; `mode`, `cheapModel`, and `replaceTitle` change without restarting. */
const Config = z.object({
	mode: z.union(GENERATION_MODES.map((mode) => z.const(mode))).default("fork").volatile().description("How the side query is built: fork reuses the agent request and model; fork-cheap reuses it with cheapModel; checkpoint sends a rolling summary plus recent messages to cheapModel."),
	cheapModel: z.object({
		provider: z.string().default(""),
		model: z.string().default(""),
		reasoningEffort: z.string().default("")
	}).default({
		provider: "",
		model: "",
		reasoningEffort: ""
	}).volatile().description("Route used by fork-cheap and checkpoint modes."),
	replaceTitle: z.boolean().default(false).volatile().description("Replace the session title with the top-level task."),
	checkpoint: z.object({
		everyMessages: positive().default(40),
		keepMessages: positive().default(8),
		summaryMaxTokens: positive().default(2e3),
		toolResultMaxChars: positive().default(2e3),
		chunkMaxChars: positive().default(12e4)
	}),
	minSteps: positive().default(2),
	minIntervalMs: positive().default(15e3),
	maxDepth: z.number().min(1).max(8).step(1).default(4),
	timeoutMs: positive().default(12e4),
	maxResponseBytes: positive().default(65536),
	maxParseRetries: z.number().min(0).max(5).step(1).default(2),
	includeSubagents: z.boolean().default(false),
	promptOutlineMaxItems: positive().default(60),
	recentLimit: positive().default(50),
	listPollIntervalMs: positive().default(15e3)
});
/** Services whose lifetime owns the scheduler. */
const inject = [
	"agents",
	"sessions",
	"sessionProjections",
	"llm",
	"storageDomain"
];
/**
* Resolve the configured cheap route.
* @param value - configured strings.
* @returns the route, or undefined when provider or model is empty.
*/
function cheapRoute(value) {
	if (value.provider.trim() === "" || value.model.trim() === "") return void 0;
	return {
		provider: value.provider.trim(),
		model: value.model.trim(),
		...value.reasoningEffort.trim() === "" ? {} : { reasoningEffort: value.reasoningEffort.trim() }
	};
}
function addUsage(total, next) {
	if (next === void 0) return total;
	if (total === void 0) return next;
	const sum = (a, b) => a === void 0 && b === void 0 ? void 0 : (a ?? 0) + (b ?? 0);
	const optional = (key) => {
		const value = sum(total[key], next[key]);
		return value === void 0 ? {} : { [key]: value };
	};
	return {
		inputTokens: total.inputTokens + next.inputTokens,
		outputTokens: total.outputTokens + next.outputTokens,
		...optional("totalTokens"),
		...optional("cacheReadTokens"),
		...optional("cacheWriteTokens"),
		...optional("reasoningTokens")
	};
}
/**
* Attach the reporter to live agents, serve the cross-session index, and unwind every timer and call on removal.
* @param ctx - plugin context.
* @param config - validated configuration.
* @returns when the projection and index are ready.
*/
async function apply(ctx, config) {
	const localeSettings = z$1.object({ preference: z$1.string().optional() });
	const outputLocale = () => {
		const descriptor = ctx.get("settings")?.describe().find((form) => form.ns === LOCALE_SETTINGS_NAMESPACE);
		return descriptor === void 0 ? void 0 : localeSettings.parse(descriptor.value).preference;
	};
	const projection = await ctx.sessionProjections.register(taskTreeProjection);
	const index = await ctx.storageDomain.open(taskIndexSpec);
	const sessions = index.table("sessions");
	const work = /* @__PURE__ */ new Map();
	let stopped = false;
	let active = 0;
	const pending = /* @__PURE__ */ new Set();
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
	const running = (entry) => !stopped && work.get(entry.agent.session.id) === entry && entry.agent.status === "running";
	const stopTimer = (entry) => {
		if (entry.timer !== void 0) clearTimeout(entry.timer);
		entry.timer = void 0;
		if (entry.startedAt !== void 0) entry.remaining = Math.max(0, entry.remaining - (performance.now() - entry.startedAt));
		entry.startedAt = void 0;
	};
	const pause = (entry) => {
		stopTimer(entry);
		entry.controller?.abort(/* @__PURE__ */ new Error("agent stopped working"));
		entry.snapshot = void 0;
	};
	const arm = (entry) => {
		if (!running(entry) || entry.timer !== void 0 || entry.due || entry.controller !== void 0) return;
		entry.startedAt = performance.now();
		entry.timer = setTimeout(() => {
			entry.timer = void 0;
			entry.startedAt = void 0;
			entry.remaining = 0;
			entry.due = true;
			pump();
		}, entry.remaining);
		entry.timer.unref?.();
	};
	const attach = (agent) => {
		if (work.has(agent.session.id) || !config.includeSubagents && agent.session.header.origin === "subagent") return;
		const entry = {
			agent,
			remaining: config.minIntervalMs,
			startedAt: void 0,
			timer: void 0,
			due: false,
			snapshot: void 0,
			controller: void 0,
			covered: projection.stateOf(agent.session).covered
		};
		work.set(agent.session.id, entry);
		arm(entry);
	};
	const flush = async (session) => {
		if (!await ctx.sessions.flush(session)) throw new Error("task-tree requires durable session persistence");
	};
	const updateIndex = async (session, seq) => {
		const tree = buildTree(projection.stateOf(session).view.records);
		const latest = tree.latest;
		if (latest === void 0) return;
		const row = {
			sessionId: session.id,
			rootTitle: latest.path[0],
			path: latest.path,
			detail: latest.detail,
			doneCount: tree.doneCount,
			totalCount: tree.totalCount,
			lastRecordSeq: seq,
			updatedAt: Date.now()
		};
		await sessions.put(session.id, row);
	};
	const updateTitle = (session, root) => {
		if (!config.replaceTitle.get()) return;
		const titles = ctx.get("sessionTitle");
		if (titles === void 0 || ctx.sessions.get(session.id) !== session) return;
		if (!mayReplaceTitle(titles.get(session), projection.stateOf(session).lastTitle, root)) return;
		const snapshot = titles.rename(session, root);
		appendPluginRecord(session, RECORD.title, {
			version: 1,
			title: snapshot.title
		});
	};
	const checkpointFor = async (session, messages, route, signal) => {
		const plan = planCheckpoint(messages, projection.stateOf(session).checkpoint, config.checkpoint);
		if (plan.kind === "use") return plan.checkpoint;
		const chunks = chunkTranscript(messages, plan.from, plan.boundary, config.checkpoint.chunkMaxChars, config.checkpoint);
		let summary = plan.base?.summary;
		let usage;
		const inputs = [];
		let used = route;
		for (const chunk of chunks) {
			const input = createSummaryInput(summary, chunk);
			inputs.push(input);
			const result = await callText(ctx, summaryRequest(route, input, config.checkpoint.summaryMaxTokens, session.id), config.maxResponseBytes, signal);
			used = result.route;
			usage = addUsage(usage, result.usage);
			const text = result.text.trim();
			if (text === "") throw new CallError("response", "the checkpoint summary was empty");
			summary = text;
		}
		if (summary === void 0) return plan.base;
		const id = randomUUID();
		const hash = prefixHash(messages, plan.boundary);
		appendPluginRecord(session, RECORD.checkpoint, {
			version: 1,
			id,
			sessionId: session.id,
			boundary: plan.boundary,
			prefixHash: hash,
			summary,
			...plan.base === void 0 ? {} : { basedOn: plan.base.id },
			route: used,
			inputs,
			...usage === void 0 ? {} : { usage }
		});
		await flush(session);
		return {
			id,
			boundary: plan.boundary,
			prefixHash: hash,
			summary
		};
	};
	const check = async (entry, snapshot, controller) => {
		const id = randomUUID();
		const { session } = entry.agent;
		const signal = controller.signal;
		const abort = () => controller.abort(snapshot.signal?.reason);
		snapshot.signal?.addEventListener("abort", abort, { once: true });
		if (snapshot.signal?.aborted) abort();
		const fail = async (attempt, stage, error, retryable) => {
			const message = error instanceof Error ? error.message : String(error);
			if (ctx.sessions.get(session.id) !== session) return;
			try {
				appendPluginRecord(session, RECORD.failure, {
					version: 1,
					id,
					attempt,
					sessionId: session.id,
					stage,
					retryable,
					message,
					canceled: signal.aborted,
					...error instanceof Error && error.stack !== void 0 ? { stack: error.stack } : {}
				});
				await flush(session);
			} catch (persistError) {
				ctx.logger.warn(`task-tree ${id}: could not persist failure: ${String(persistError)}`);
			}
			if (!signal.aborted) ctx.logger.warn(`task-tree ${id}, attempt ${attempt}, ${stage}: ${message}`);
		};
		try {
			const mode = config.mode.get();
			const route = mode === "fork" ? void 0 : cheapRoute(config.cheapModel.get());
			if (mode !== "fork" && route === void 0) {
				await fail(1, "config", /* @__PURE__ */ new Error(`generation mode ${mode} requires cheapModel.provider and cheapModel.model`), false);
				return;
			}
			const messages = snapshot.request.messages;
			let checkpoint;
			if (mode === "checkpoint") try {
				checkpoint = await checkpointFor(session, messages, route, signal);
			} catch (error) {
				await fail(1, "checkpoint", error, false);
				return;
			}
			const tree = buildTree(projection.stateOf(session).view.records);
			const outline = outlineForPrompt(tree, config.promptOutlineMaxItems);
			const known = knownDecisions(tree);
			for (let attempt = 1;; attempt++) {
				let stage = "prepare";
				try {
					signal.throwIfAborted();
					const question = createQuestion({
						maxDepth: config.maxDepth,
						outline,
						locale: outputLocale(),
						retry: attempt > 1
					});
					const result = await callText(ctx, mode === "checkpoint" ? checkpointRequest(route, checkpoint?.summary, renderTranscript(messages, checkpoint?.boundary ?? 0, messages.length, config.checkpoint), question, session.id) : forkRequest(snapshot.request, question, route), config.maxResponseBytes, signal, { beforeDispatch: async (request, used) => {
						stage = "request";
						appendPluginRecord(session, RECORD.request, {
							version: 1,
							id,
							attempt,
							sessionId: session.id,
							mode,
							route: used,
							contextSeq: snapshot.seq,
							reusedMessages: mode === "checkpoint" ? 0 : messages.length,
							...checkpoint === void 0 ? {} : { checkpointId: checkpoint.id },
							...mode === "checkpoint" && request.system !== void 0 ? { system: request.system } : {},
							input: mode === "checkpoint" ? requestInput(request) : question,
							...request.maxTokens === void 0 ? {} : { maxTokens: request.maxTokens }
						});
						await flush(session);
						stage = "response";
					} });
					stage = "parse";
					const parsed = modelAnswerSchema.safeParse(parseJsonAnswer(result.text));
					if (!parsed.success) throw new CallError("parse", `answer did not match the schema: ${parsed.error.message}`, true);
					if (!running(entry)) throw new Error("agent stopped working");
					const resolved = resolveReportedPath(parsed.data.path.slice(0, config.maxDepth), tree);
					if (resolved.kind === "unresolved-alias") throw new CallError("parse", `path level ${resolved.depth + 1} uses @ but the existing tree has no item there`, true);
					const path = resolved.path;
					const seen = new Set(known);
					const decisions = parsed.data.decisions.filter((decision) => {
						const key = normalizeText(decision);
						if (seen.has(key)) return false;
						seen.add(key);
						return true;
					});
					const previousPath = tree.latest?.path ?? [];
					stage = "persist";
					const seq = appendPluginRecord(session, RECORD.result, {
						version: 1,
						id,
						attempt,
						sessionId: session.id,
						mode,
						route: result.route,
						contextSeq: snapshot.seq,
						coveredStepCount: snapshot.stepCount,
						...snapshot.turn === void 0 ? {} : { coveredTurn: snapshot.turn },
						...snapshot.step === void 0 ? {} : { coveredStep: snapshot.step },
						path,
						previousPath,
						detail: parsed.data.detail,
						decisions,
						blocks: result.blocks,
						...result.usage === void 0 ? {} : { usage: result.usage }
					});
					await flush(session);
					entry.covered = snapshot.stepCount;
					try {
						if (previousPath[0] !== path[0] || !samePath(previousPath.slice(0, 1), path.slice(0, 1))) updateTitle(session, path[0]);
					} catch (error) {
						ctx.logger.warn(`task-tree ${id}: title update failed: ${String(error)}`);
					}
					await updateIndex(session, seq).catch((error) => {
						ctx.logger.warn(`task-tree ${id}: index update failed: ${String(error)}`);
					});
					return;
				} catch (error) {
					const failedStage = error instanceof CallError ? error.stage : stage;
					const retryable = error instanceof CallError && error.retryable;
					await fail(attempt, failedStage, error, retryable);
					if (!retryable || attempt > config.maxParseRetries || signal.aborted || !running(entry)) return;
				}
			}
		} finally {
			snapshot.signal?.removeEventListener("abort", abort);
		}
	};
	function pump() {
		if (stopped) return;
		for (const entry of work.values()) {
			if (active >= 1) break;
			if (!running(entry) || entry.controller !== void 0 || !entry.due) continue;
			const snapshot = entry.snapshot;
			if (snapshot === void 0 || snapshot.stepCount - entry.covered < config.minSteps) continue;
			stopTimer(entry);
			entry.due = false;
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("task-tree timed out")), config.timeoutMs);
			timeout.unref?.();
			entry.controller = controller;
			active++;
			const run = Promise.resolve().then(() => check(entry, snapshot, controller)).catch((error) => {
				ctx.logger.warn(`task-tree: ${String(error)}`);
			}).finally(() => {
				clearTimeout(timeout);
				pending.delete(run);
				active--;
				if (entry.controller === controller) entry.controller = void 0;
				entry.remaining = config.minIntervalMs;
				arm(entry);
				pump();
			});
			pending.add(run);
		}
	}
	ctx.inject(["connection"], (scope) => {
		registerTaskTreeRpc(scope, async (endpoint, payload) => {
			if (endpoint !== "task-tree/list" || !listRequestSchema.safeParse(payload).success) return {
				ok: false,
				error: {
					code: "task-tree/invalid-request",
					message: "invalid task-tree request",
					details: {}
				}
			};
			return {
				ok: true,
				value: {
					rows: [...sessions.entries()].map(([, row]) => row).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, config.recentLimit),
					pollIntervalMs: config.listPollIntervalMs
				}
			};
		});
	});
	ctx.on("agent/created", ({ agent }) => {
		attach(agent);
	}, { global: true });
	ctx.on("agent/status", ({ agent, status }) => {
		attach(agent);
		const entry = work.get(agent.session.id);
		if (entry === void 0) return;
		if (status === "idle") pause(entry);
		else arm(entry);
	}, { global: true });
	ctx.on("agent/disposed", ({ agent }) => {
		const entry = work.get(agent.session.id);
		if (entry === void 0) return;
		pause(entry);
		work.delete(agent.session.id);
	}, { global: true });
	ctx.on("session/event", (session, event) => {
		const entry = work.get(session.id);
		if (entry !== void 0 && "surfaceOp" in event && event.surfaceOp !== void 0) entry.snapshot = void 0;
	}, { global: true });
	ctx.on("llm/stream", (options, next) => {
		if (isAgentLoopRequest(options) && options.sessionId !== void 0) {
			const entry = work.get(options.sessionId);
			if (entry !== void 0 && running(entry)) {
				const { signal, purpose: _purpose, ...request } = options;
				const state = projection.stateOf(entry.agent.session);
				entry.snapshot = {
					request: structuredClone(request),
					signal,
					stepCount: state.stepCount,
					seq: Math.max(0, entry.agent.session.seq - 1),
					turn: state.turn,
					step: state.step
				};
				pump();
			}
		}
		return next();
	}, {
		global: true,
		prepend: true
	});
	ctx.effect(() => () => {
		stopped = true;
		for (const entry of work.values()) pause(entry);
		work.clear();
		return Promise.allSettled([...pending]).then(() => index.close());
	});
	for (const agent of ctx.agents.list()) attach(agent);
}
//#endregion
export { Config, apply, cheapRoute, inject };

//# sourceMappingURL=index.js.map
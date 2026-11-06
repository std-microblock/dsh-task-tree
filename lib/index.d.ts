import z from "@deepseek-ai/schemastery";
import { z as z$1 } from "zod";
import { ContentBlock, TokenUsage } from "@deepseek-ai/dsh-llm";
import { Context, Volatile } from "@deepseek-ai/cordis";
import { SessionId } from "@deepseek-ai/dsh-session/types";

//#region ../deepseek-harness/packages/util/brand/lib/types/index.d.ts
/**
 * Duplicate-install-safe nominal primitive helpers.
 *
 * A brand makes structurally identical strings or numbers non-interchangeable
 * at the type level: a `SessionId` cannot be passed where a `ToolCallId` is
 * expected, and an event sequence cannot be passed as a log offset. Comparison,
 * logging, and serialization retain the underlying primitive behavior.
 *
 * This package owns no concrete domain value and keeps no runtime identity or mutable
 * state, so independently installed copies produce interchangeable values.
 *
 * @module @deepseek-ai/dsh-brand
 */
declare const BRAND: unique symbol;
/** A string carrying a compile-time-only brand `B`. */
type Branded<B extends string> = string & {
  readonly [BRAND]: B;
};
//#endregion
//#region src/records.d.ts
/** Identity of one auxiliary request and its settlement. */
type ReportId = Branded<'TaskTreeReportId'>;
/** Identity of one rolling-summary checkpoint. */
type CheckpointId = Branded<'TaskTreeCheckpointId'>;
/** How the auxiliary request is built. */
declare const GENERATION_MODES: readonly ["fork", "fork-cheap", "checkpoint"];
/** One of {@link GENERATION_MODES}. */
type GenerationMode = typeof GENERATION_MODES[number];
/** Exact provider route of one auxiliary call. */
declare const routeSchema: z$1.ZodObject<{
  provider: z$1.ZodString;
  model: z$1.ZodString;
  reasoningEffort: z$1.ZodOptional<z$1.ZodString>;
}, z$1.core.$strict>;
/** Provider route recorded with each request. */
type Route = z$1.infer<typeof routeSchema>;
/** Persisted successful report fields consumed by the tree, the Client, and the index. */
declare const resultSchema: z$1.ZodObject<{
  version: z$1.ZodLiteral<1>;
  id: z$1.ZodString;
  sessionId: z$1.ZodString;
  mode: z$1.ZodEnum<{
    fork: "fork";
    "fork-cheap": "fork-cheap";
    checkpoint: "checkpoint";
  }>;
  contextSeq: z$1.ZodNumber;
  coveredStepCount: z$1.ZodNumber;
  coveredTurn: z$1.ZodOptional<z$1.ZodNumber>;
  coveredStep: z$1.ZodOptional<z$1.ZodNumber>;
  path: z$1.ZodArray<z$1.ZodString>;
  previousPath: z$1.ZodArray<z$1.ZodString>;
  detail: z$1.ZodString;
  decisions: z$1.ZodArray<z$1.ZodString>;
}, z$1.core.$strip>;
/** Validated result fields. */
type ResultData = z$1.infer<typeof resultSchema>;
/** Durable successful report and model accounting. */
interface ResultRecord extends Omit<ResultData, 'id' | 'sessionId'> {
  id: ReportId;
  sessionId: SessionId;
  attempt: number;
  route: Route;
  blocks: ContentBlock[];
  usage?: TokenUsage;
}
/** Exact auxiliary input appended to, or replacing, the captured context. */
interface RequestRecord {
  version: 1;
  id: ReportId;
  attempt: number;
  sessionId: SessionId;
  mode: GenerationMode;
  route: Route;
  contextSeq: number;
  /** Number of captured agent-loop messages the request reuses; zero in checkpoint mode. */
  reusedMessages: number;
  checkpointId?: CheckpointId;
  /** System text of a checkpoint-mode request; fork modes reuse the captured system message. */
  system?: string;
  /** The user text appended after the reused messages, or the complete checkpoint-mode input. */
  input: string;
  maxTokens?: number;
}
/** Rolling summary of the captured messages before a boundary. */
declare const checkpointSchema: z$1.ZodObject<{
  version: z$1.ZodLiteral<1>;
  id: z$1.ZodString;
  sessionId: z$1.ZodString;
  boundary: z$1.ZodNumber;
  prefixHash: z$1.ZodString;
  summary: z$1.ZodString;
  basedOn: z$1.ZodOptional<z$1.ZodString>;
}, z$1.core.$strip>;
/** Validated checkpoint fields. */
type CheckpointData = z$1.infer<typeof checkpointSchema>;
/** Durable checkpoint and model accounting. */
interface CheckpointRecord extends Omit<CheckpointData, 'id' | 'sessionId' | 'basedOn'> {
  id: CheckpointId;
  sessionId: SessionId;
  basedOn?: CheckpointId;
  route: Route;
  /** Exact summarization inputs, one per sequential chunk. */
  inputs: string[];
  usage?: TokenUsage;
}
/** Operation that failed. */
type FailureStage = 'config' | 'checkpoint' | 'prepare' | 'request' | 'response' | 'parse' | 'persist';
/** Failed or canceled attempt; it does not move the covered-step watermark. */
interface FailureRecord {
  version: 1;
  id: ReportId;
  attempt: number;
  sessionId: SessionId;
  stage: FailureStage;
  retryable: boolean;
  message: string;
  canceled: boolean;
  stack?: string;
}
/** Title written by this plugin, so a later rename can tell it from a user's title. */
declare const titleSchema: z$1.ZodObject<{
  version: z$1.ZodLiteral<1>;
  title: z$1.ZodString;
}, z$1.core.$strip>;
/** Durable title-rename marker. */
type TitleRecord = z$1.infer<typeof titleSchema>;
declare module '@deepseek-ai/dsh-session/types' {
  interface PluginRecordMap {
    'plugin:task-tree/request': RequestRecord;
    'plugin:task-tree/result': ResultRecord;
    'plugin:task-tree/failure': FailureRecord;
    'plugin:task-tree/checkpoint': CheckpointRecord;
    'plugin:task-tree/title': TitleRecord;
  }
}
/** Minimal event envelope readable from storage, history, or the wire. */
//#endregion
//#region src/generate/checkpoint.d.ts
/** Checkpoint cadence and rendering limits. */
interface CheckpointConfig {
  /** Messages after the boundary that trigger a new checkpoint when exceeded. */
  everyMessages: number;
  /** Messages kept verbatim after a new boundary. */
  keepMessages: number;
  summaryMaxTokens: number;
  toolResultMaxChars: number;
  chunkMaxChars: number;
}
//#endregion
//#region src/projection-types.d.ts
/** One successful report as published to the Client and folded into the tree. */
interface TreeRecord {
  /** Report id shared with the Chat row. */
  id: string;
  /** Session seq of the result record itself. */
  seq: number;
  /** Session seq of the last event visible to the reported context. */
  contextSeq: number;
  coveredTurn?: number | undefined;
  mode: GenerationMode;
  path: string[];
  previousPath: string[];
  detail: string;
  decisions: string[];
}
/** Wire value of the `taskTree` projection. */
interface TaskTreeView {
  records: TreeRecord[];
}
declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    /** Successful task-tree reports of this Session in log order; excluded from Session list summaries. */
    taskTree: SessionProjectionSummaryExcluded<TaskTreeView>;
  }
}
/** Cross-session row returned by the list RPC and kept in the Host storage index. */
interface TaskIndexRow {
  sessionId: string;
  /** Top-level item of the latest report. */
  rootTitle: string;
  path: string[];
  detail: string;
  doneCount: number;
  totalCount: number;
  /** Session seq of the latest result record; the Client compares it with what the user has seen. */
  lastRecordSeq: number;
  /** Epoch milliseconds of the latest report. */
  updatedAt: number;
}
/** Response of the list RPC. */
interface TaskListResponse {
  rows: TaskIndexRow[];
  pollIntervalMs: number;
}
//#endregion
//#region src/index.d.ts
/** Cheap route edited as plain strings; empty provider or model means not configured. */
interface CheapModel {
  provider: string;
  model: string;
  reasoningEffort: string;
}
/** Deployment-owned cadence, limits, generation mode, and title policy. */
interface Config {
  mode: Volatile<GenerationMode>;
  cheapModel: Volatile<CheapModel>;
  replaceTitle: Volatile<boolean>;
  checkpoint: CheckpointConfig;
  minSteps: number;
  minIntervalMs: number;
  maxDepth: number;
  timeoutMs: number;
  maxResponseBytes: number;
  maxParseRetries: number;
  includeSubagents: boolean;
  promptOutlineMaxItems: number;
  recentLimit: number;
  listPollIntervalMs: number;
}
/** Validated configuration; `mode`, `cheapModel`, and `replaceTitle` change without restarting. */
declare const Config: z<Schemastery.ObjectS<NoInfer<{
  mode: z<"fork" | "fork-cheap" | "checkpoint", "fork" | "fork-cheap" | "checkpoint", "volatile-defined">;
  cheapModel: z<NoInfer<Schemastery.ObjectS<NoInfer<{
    provider: z<string, string, "defined">;
    model: z<string, string, "defined">;
    reasoningEffort: z<string, string, "defined">;
  }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
    provider: z<string, string, "defined">;
    model: z<string, string, "defined">;
    reasoningEffort: z<string, string, "defined">;
  }>>>, "volatile-defined">;
  replaceTitle: z<boolean, boolean, "volatile-defined">;
  checkpoint: z<Schemastery.ObjectS<NoInfer<{
    everyMessages: z<number, number, "defined">;
    keepMessages: z<number, number, "defined">;
    summaryMaxTokens: z<number, number, "defined">;
    toolResultMaxChars: z<number, number, "defined">;
    chunkMaxChars: z<number, number, "defined">;
  }>>, Schemastery.ObjectT<NoInfer<{
    everyMessages: z<number, number, "defined">;
    keepMessages: z<number, number, "defined">;
    summaryMaxTokens: z<number, number, "defined">;
    toolResultMaxChars: z<number, number, "defined">;
    chunkMaxChars: z<number, number, "defined">;
  }>>, "plain">;
  minSteps: z<number, number, "defined">;
  minIntervalMs: z<number, number, "defined">;
  maxDepth: z<number, number, "defined">;
  timeoutMs: z<number, number, "defined">;
  maxResponseBytes: z<number, number, "defined">;
  maxParseRetries: z<number, number, "defined">;
  includeSubagents: z<boolean, boolean, "defined">;
  promptOutlineMaxItems: z<number, number, "defined">;
  recentLimit: z<number, number, "defined">;
  listPollIntervalMs: z<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
  mode: z<"fork" | "fork-cheap" | "checkpoint", "fork" | "fork-cheap" | "checkpoint", "volatile-defined">;
  cheapModel: z<NoInfer<Schemastery.ObjectS<NoInfer<{
    provider: z<string, string, "defined">;
    model: z<string, string, "defined">;
    reasoningEffort: z<string, string, "defined">;
  }>>>, NoInfer<Schemastery.ObjectT<NoInfer<{
    provider: z<string, string, "defined">;
    model: z<string, string, "defined">;
    reasoningEffort: z<string, string, "defined">;
  }>>>, "volatile-defined">;
  replaceTitle: z<boolean, boolean, "volatile-defined">;
  checkpoint: z<Schemastery.ObjectS<NoInfer<{
    everyMessages: z<number, number, "defined">;
    keepMessages: z<number, number, "defined">;
    summaryMaxTokens: z<number, number, "defined">;
    toolResultMaxChars: z<number, number, "defined">;
    chunkMaxChars: z<number, number, "defined">;
  }>>, Schemastery.ObjectT<NoInfer<{
    everyMessages: z<number, number, "defined">;
    keepMessages: z<number, number, "defined">;
    summaryMaxTokens: z<number, number, "defined">;
    toolResultMaxChars: z<number, number, "defined">;
    chunkMaxChars: z<number, number, "defined">;
  }>>, "plain">;
  minSteps: z<number, number, "defined">;
  minIntervalMs: z<number, number, "defined">;
  maxDepth: z<number, number, "defined">;
  timeoutMs: z<number, number, "defined">;
  maxResponseBytes: z<number, number, "defined">;
  maxParseRetries: z<number, number, "defined">;
  includeSubagents: z<boolean, boolean, "defined">;
  promptOutlineMaxItems: z<number, number, "defined">;
  recentLimit: z<number, number, "defined">;
  listPollIntervalMs: z<number, number, "defined">;
}>>, "plain">;
/** Services whose lifetime owns the scheduler. */
declare const inject: string[];
/**
 * Resolve the configured cheap route.
 * @param value - configured strings.
 * @returns the route, or undefined when provider or model is empty.
 */
declare function cheapRoute(value: CheapModel): Route | undefined;
/**
 * Attach the reporter to live agents, serve the cross-session index, and unwind every timer and call on removal.
 * @param ctx - plugin context.
 * @param config - validated configuration.
 * @returns when the projection and index are ready.
 */
declare function apply(ctx: Context, config: Config): Promise<void>;
//#endregion
export { CheapModel, Config, type TaskIndexRow, type TaskListResponse, type TaskTreeView, type TreeRecord, apply, cheapRoute, inject };
//# sourceMappingURL=index.d.ts.map
# 配置

所有设置都能在「插件 → 任务树」的插件页里改；需要写进 profile 配置的，按下面的字段来。

## 按 id 覆盖

在 profile 的 patch 层按 id `task-tree` 覆盖。DSH 按 id **整段替换** `config`，请写全需要保留的键：

```yaml
- id: task-tree
  config:
    mode: checkpoint
    cheapModel: { provider: deepseek, model: deepseek-chat, reasoningEffort: '' }
    replaceTitle: true
```

## 字段

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `mode` | `fork` | `fork` / `fork-cheap` / `checkpoint`；可在插件页实时切换 |
| `cheapModel` | 空 | `{ provider, model, reasoningEffort }`，`fork-cheap` 与 `checkpoint` 必填，可在插件页填写；`provider` 为已配置的模型供应商路由 id |
| `replaceTitle` | `false` | 用最顶级事项替换会话标题；可在插件页实时切换 |
| `checkpoint.everyMessages` | `40` | 断点后超过多少条消息时推进断点 |
| `checkpoint.keepMessages` | `8` | 推进断点后保留的原文消息数 |
| `checkpoint.summaryMaxTokens` | `2000` | 摘要输出 token 上限 |
| `checkpoint.toolResultMaxChars` | `2000` | 对话文本中每个工具结果/参数保留的字符数 |
| `checkpoint.chunkMaxChars` | `120000` | 重建摘要时每块的字符预算 |
| `minSteps` | `2` | 两次汇报之间至少新增的已完成 step |
| `minIntervalMs` | `15000` | 两次汇报之间累计的工作时间 |
| `maxDepth` | `4` | 事项路径最大层级 |
| `timeoutMs` | `120000` | 一次汇报（含断点摘要与重试）的超时 |
| `maxResponseBytes` | `65536` | 每次调用接受的响应大小上限 |
| `maxParseRetries` | `2` | 格式不合格时的重试次数 |
| `includeSubagents` | `false` | 是否也为子智能体会话生成任务树 |
| `promptOutlineMaxItems` | `60` | 提示中附带的已有事项上限（超出时折叠最早完成的同级事项） |
| `recentLimit` | `50` | 「事项」页最多列出的会话数 |
| `listPollIntervalMs` | `15000` | 「事项」页刷新间隔 |

## 三种生成方式

| 方式 | 请求内容 | 特点 |
| --- | --- | --- |
| `fork`（主模型） | 原样复用主智能体最近一次请求（系统提示、全部消息、工具），追加一条提问；使用主模型 | 与主任务共享 KV 缓存前缀，质量最好 |
| `fork-cheap`（廉价模型） | 同上，但路由换成 `cheapModel` | 廉价模型自身的前缀缓存在多次查询间可复用 |
| `checkpoint`（廉价模型 + 断点摘要） | `[断点前内容的滚动摘要] + [断点后的完整对话文本] + 提问`，发给 `cheapModel` | 断点后消息超过 `checkpoint.everyMessages` 条时，用廉价模型把旧断点摘要和新增内容合并成新摘要（类似 compact），只保留最后 `keepMessages` 条原文；两次断点之间请求只在末尾追加，既命中缓存又显著降低 token 费用 |

断点不会切在工具调用和它的结果之间；如果主智能体自己压缩了上下文（或会话被 fork/恢复），断点前内容的哈希不再匹配，会分块重新生成摘要。

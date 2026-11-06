/** Task-tree RPC carried by Connection's authenticated shared API routes. */
import type { Context } from '@deepseek-ai/cordis'
import { clientRequestSchema, transportError } from '@deepseek-ai/dsh-client-connection'
import type { ConnectionRpcHandler } from '@deepseek-ai/dsh-client-connection'
import { LIST_METHOD, TASK_TREE_CHANNEL } from './protocol.ts'

/**
 * Register owner-only routes.
 * @param ctx - context exposing `connection`.
 * @param handler - endpoint handler.
 */
export function registerTaskTreeRpc(ctx: Context, handler: ConnectionRpcHandler): void {
  for (const endpoint of [LIST_METHOD]) {
    ctx.connection.fetch.register({
      path: `${TASK_TREE_CHANNEL}/${endpoint}`, methods: ['POST'], requestBody: 'buffered',
      fetch: async request => {
        if (request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() !== 'application/json') {
          return new Response(null, { status: 415 })
        }
        let body: unknown
        try {
          body = await request.json()
        } catch (_error: unknown) {
          // Malformed JSON is a client error with no further detail to report.
          return new Response(null, { status: 400 })
        }
        const parsed = clientRequestSchema.safeParse(body)
        if (!parsed.success || parsed.data.method !== endpoint) return new Response(null, { status: 400 })
        const result = await handler(endpoint, parsed.data.payload, request.signal, ctx.connection.browserPeer)
          .catch(transportError)
        return Response.json({ type: 'server-response', rpcId: parsed.data.rpcId, result })
      },
    })
  }
}

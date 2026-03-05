# Node.js Best Practices Playbook

Derived from `mcollina/skills` Node rules:
- https://github.com/mcollina/skills/tree/main/skills/node/rules

## 1. TypeScript runtime model
- Prefer Node native type stripping (Node 22.6+) over `ts-node`/`tsx` for runtime execution.
- Use `import type` for type-only imports.
- Include explicit file extensions in ESM imports.
- Avoid enums/namespaces/parameter properties when targeting type stripping.

## 2. Async patterns
- Prefer `async`/`await` over Promise chains.
- Use `Promise.all` for independent work.
- Use controlled concurrency (`p-limit` or `p-map`) for large batches.
- Use `Promise.allSettled` for partial-failure workflows.
- Use `AbortController` for cancellation/timeouts.
- Avoid async constructors; use async factory methods.

## 3. Error handling
- Use structured custom errors with stable `code` and `statusCode`.
- Check errors by code, not class identity.
- Never swallow errors in empty `catch`.
- Preserve causes (`new Error(message, { cause })`).
- Use centralized framework error handlers (e.g., Fastify `setErrorHandler`).
- Prefer `close-with-grace` over ad-hoc `uncaughtException`/`unhandledRejection` handlers.

## 4. Shutdown and lifecycle
- Implement graceful shutdown (`SIGTERM`, `SIGINT`) with `close-with-grace`.
- Mark app as shutting down and fail readiness checks during drain.
- Close resources in reverse init order (HTTP server, queues, cache, DB).
- Use time-bounded shutdown for orchestrators (Kubernetes-friendly delays).

## 5. Logging and debugging
- Use structured JSON logging (Pino).
- Use correct levels (`debug`, `info`, `warn`, `error`).
- Use child loggers to bind context (`requestId`, `userId`).
- Redact sensitive fields (`password`, `token`, `authorization`).
- Use transports for formatting/output routing.
- Use `debug`/`util.debuglog` for module diagnostics, not business logs.

## 6. Caching
- Use async cache with dedupe for expensive async calls.
- Use TTL + stale windows where eventual consistency is acceptable.
- Add invalidation strategy (single key, namespace, reference-based).
- Use bounded in-memory caches (LRU) to avoid unbounded growth.
- Avoid caching sensitive or strongly-consistent data without strict controls.

## 7. Modules and packaging
- Prefer ESM for new services.
- Prefer named exports over default exports.
- Use dynamic import for optional/heavy modules.
- Use modern ESM helpers (`import.meta.dirname`, `import.meta.filename` where supported).

## 8. Streams and performance
- Prefer streams/pipelines for large payload processing.
- Design for backpressure to avoid memory spikes.
- Move CPU-heavy work off the event loop (worker threads/process boundaries).
- Profile before optimization; benchmark representative paths.

## 9. Testing and flaky-test prevention
- Use deterministic tests (fixed time, fixed IDs, isolated state).
- Avoid arbitrary sleeps; wait for explicit conditions.
- Use dynamic ports (`0`) in tests.
- Ensure resource cleanup (`t.after`, handle close).
- Mock external network calls in unit tests.
- In CI: control concurrency/timeouts and detect open handles.

## 10. Environment configuration
- Load env via Node built-ins (`--env-file`, `process.loadEnvFile`).
- Validate env at startup with a schema.
- Fail fast on invalid/missing configuration.
- Keep secrets out of logs and source control.

## Applying this to our backend
- Add structured logger (Pino) and request-id propagation.
- Add shared app error utilities (`code` + `statusCode` + `cause`).
- Add graceful shutdown wiring for Express server and DB pool.
- Add env schema validation at process boot.
- Add flaky-test guardrails for backend unit/integration tests.

## Notes
- Some points above are direct from rule excerpts.
- Some are inferred from the rule file names and summaries where full file text was truncated by the browsing tool.

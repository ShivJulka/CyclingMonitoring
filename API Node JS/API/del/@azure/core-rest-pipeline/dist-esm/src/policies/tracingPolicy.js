// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { getTraceParentHeader, createSpanFunction, SpanStatusCode } from "@azure/core-tracing";
import { SpanKind } from "@azure/core-tracing";
import { URL } from "../util/url";
import { getUserAgentValue } from "../util/userAgent";
const createSpan = createSpanFunction({
    packagePrefix: "",
    namespace: ""
});
/**
 * The programmatic identifier of the tracingPolicy.
 */
export const tracingPolicyName = "tracingPolicy";
/**
 * A simple policy to create OpenTelemetry Spans for each request made by the pipeline
 * that has SpanOptions with a parent.
 * Requests made without a parent Span will not be recorded.
 * @param options - Options to configure the telemetry logged by the tracing policy.
 */
export function tracingPolicy(options = {}) {
    const userAgent = getUserAgentValue(options.userAgentPrefix);
    return {
        name: tracingPolicyName,
        async sendRequest(request, next) {
            var _a;
            if (!((_a = request.tracingOptions) === null || _a === void 0 ? void 0 : _a.tracingContext)) {
                return next(request);
            }
            // create a new span
            const tracingOptions = Object.assign(Object.assign({}, request.tracingOptions), { spanOptions: Object.assign(Object.assign({}, request.tracingOptions.spanOptions), { kind: SpanKind.CLIENT }) });
            const url = new URL(request.url);
            const path = url.pathname || "/";
            const { span } = createSpan(path, { tracingOptions });
            span.setAttributes({
                "http.method": request.method,
                "http.url": request.url,
                requestId: request.requestId
            });
            if (userAgent) {
                span.setAttribute("http.user_agent", userAgent);
            }
            try {
                // set headers
                const spanContext = span.spanContext();
                const traceParentHeader = getTraceParentHeader(spanContext);
                if (traceParentHeader) {
                    request.headers.set("traceparent", traceParentHeader);
                    const traceState = spanContext.traceState && spanContext.traceState.serialize();
                    // if tracestate is set, traceparent MUST be set, so only set tracestate after traceparent
                    if (traceState) {
                        request.headers.set("tracestate", traceState);
                    }
                }
                const response = await next(request);
                span.setAttribute("http.status_code", response.status);
                const serviceRequestId = response.headers.get("x-ms-request-id");
                if (serviceRequestId) {
                    span.setAttribute("serviceRequestId", serviceRequestId);
                }
                span.setStatus({
                    code: SpanStatusCode.OK
                });
                return response;
            }
            catch (err) {
                span.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: err.message
                });
                span.setAttribute("http.status_code", err.statusCode);
                throw err;
            }
            finally {
                span.end();
            }
        }
    };
}
//# sourceMappingURL=tracingPolicy.js.map
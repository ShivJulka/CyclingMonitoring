import { BaseRequestPolicy, RequestPolicy, RequestPolicyFactory, RequestPolicyOptions } from "./requestPolicy";
import { HttpOperationResponse } from "../httpOperationResponse";
import { ProxySettings } from "../serviceClient";
import { WebResourceLike } from "../webResource";
/**
 * @internal
 */
export declare const noProxyList: string[];
/**
 * @internal
 */
export declare function loadNoProxy(): string[];
export declare function getDefaultProxySettings(proxyUrl?: string): ProxySettings | undefined;
export declare function proxyPolicy(proxySettings?: ProxySettings): RequestPolicyFactory;
export declare class ProxyPolicy extends BaseRequestPolicy {
    proxySettings: ProxySettings;
    constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, proxySettings: ProxySettings);
    sendRequest(request: WebResourceLike): Promise<HttpOperationResponse>;
}
//# sourceMappingURL=proxyPolicy.d.ts.map

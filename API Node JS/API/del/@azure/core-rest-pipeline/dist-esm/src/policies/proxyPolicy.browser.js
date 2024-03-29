// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/*
 * NOTE: When moving this file, please update "browser" section in package.json
 */
const NotSupported = new Error("proxyPolicy is not supported in browser environment");
export const proxyPolicyName = "proxyPolicy";
export function getDefaultProxySettings() {
    throw NotSupported;
}
/**
 * proxyPolicy is not supported in the browser and attempting
 * to use it will raise an error.
 */
export function proxyPolicy() {
    throw NotSupported;
}
//# sourceMappingURL=proxyPolicy.browser.js.map
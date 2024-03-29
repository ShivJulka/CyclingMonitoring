// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { v4 as uuidv4 } from "uuid";
import { Constants } from "./constants";
import { XML_ATTRKEY } from "./serializer.common";
var validUuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
/**
 * A constant that indicates whether the environment is node.js or browser based.
 */
export var isNode = typeof process !== "undefined" &&
    !!process.version &&
    !!process.versions &&
    !!process.versions.node;
/**
 * Checks if a parsed URL is HTTPS
 *
 * @param urlToCheck - The url to check
 * @returns True if the URL is HTTPS; false otherwise.
 */
export function urlIsHTTPS(urlToCheck) {
    return urlToCheck.protocol.toLowerCase() === Constants.HTTPS;
}
/**
 * Encodes an URI.
 *
 * @param uri - The URI to be encoded.
 * @returns The encoded URI.
 */
export function encodeUri(uri) {
    return encodeURIComponent(uri)
        .replace(/!/g, "%21")
        .replace(/"/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A");
}
/**
 * Returns a stripped version of the Http Response which only contains body,
 * headers and the status.
 *
 * @param response - The Http Response
 * @returns The stripped version of Http Response.
 */
export function stripResponse(response) {
    var strippedResponse = {};
    strippedResponse.body = response.bodyAsText;
    strippedResponse.headers = response.headers;
    strippedResponse.status = response.status;
    return strippedResponse;
}
/**
 * Returns a stripped version of the Http Request that does not contain the
 * Authorization header.
 *
 * @param request - The Http Request object
 * @returns The stripped version of Http Request.
 */
export function stripRequest(request) {
    var strippedRequest = request.clone();
    if (strippedRequest.headers) {
        strippedRequest.headers.remove("authorization");
    }
    return strippedRequest;
}
/**
 * Validates the given uuid as a string
 *
 * @param uuid - The uuid as a string that needs to be validated
 * @returns True if the uuid is valid; false otherwise.
 */
export function isValidUuid(uuid) {
    return validUuidRegex.test(uuid);
}
/**
 * Generated UUID
 *
 * @returns RFC4122 v4 UUID.
 */
export function generateUuid() {
    return uuidv4();
}
/**
 * Executes an array of promises sequentially. Inspiration of this method is here:
 * https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html. An awesome blog on promises!
 *
 * @param promiseFactories - An array of promise factories(A function that return a promise)
 * @param kickstart - Input to the first promise that is used to kickstart the promise chain.
 * If not provided then the promise chain starts with undefined.
 * @returns A chain of resolved or rejected promises
 */
export function executePromisesSequentially(promiseFactories, kickstart) {
    var result = Promise.resolve(kickstart);
    promiseFactories.forEach(function (promiseFactory) {
        result = result.then(promiseFactory);
    });
    return result;
}
/**
 * A wrapper for setTimeout that resolves a promise after t milliseconds.
 * @param t - The number of milliseconds to be delayed.
 * @param value - The value to be resolved with after a timeout of t milliseconds.
 * @returns Resolved promise
 */
export function delay(t, value) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(value); }, t); });
}
/**
 * Converts a Promise to a callback.
 * @param promise - The Promise to be converted to a callback
 * @returns A function that takes the callback `(cb: Function) => void`
 * @deprecated generated code should instead depend on responseToBody
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function promiseToCallback(promise) {
    if (typeof promise.then !== "function") {
        throw new Error("The provided input is not a Promise.");
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (cb) {
        promise
            .then(function (data) {
            // eslint-disable-next-line promise/no-callback-in-promise
            return cb(undefined, data);
        })
            .catch(function (err) {
            // eslint-disable-next-line promise/no-callback-in-promise
            cb(err);
        });
    };
}
/**
 * Converts a Promise to a service callback.
 * @param promise - The Promise of HttpOperationResponse to be converted to a service callback
 * @returns A function that takes the service callback (cb: ServiceCallback<T>): void
 */
export function promiseToServiceCallback(promise) {
    if (typeof promise.then !== "function") {
        throw new Error("The provided input is not a Promise.");
    }
    return function (cb) {
        promise
            .then(function (data) {
            return process.nextTick(cb, undefined, data.parsedBody, data.request, data);
        })
            .catch(function (err) {
            process.nextTick(cb, err);
        });
    };
}
export function prepareXMLRootList(obj, elementName, xmlNamespaceKey, xmlNamespace) {
    var _a, _b, _c;
    if (!Array.isArray(obj)) {
        obj = [obj];
    }
    if (!xmlNamespaceKey || !xmlNamespace) {
        return _a = {}, _a[elementName] = obj, _a;
    }
    var result = (_b = {}, _b[elementName] = obj, _b);
    result[XML_ATTRKEY] = (_c = {}, _c[xmlNamespaceKey] = xmlNamespace, _c);
    return result;
}
/**
 * Applies the properties on the prototype of sourceCtors to the prototype of targetCtor
 * @param targetCtor - The target object on which the properties need to be applied.
 * @param sourceCtors - An array of source objects from which the properties need to be taken.
 */
export function applyMixins(targetCtorParam, sourceCtors) {
    var castTargetCtorParam = targetCtorParam;
    sourceCtors.forEach(function (sourceCtor) {
        Object.getOwnPropertyNames(sourceCtor.prototype).forEach(function (name) {
            castTargetCtorParam.prototype[name] = sourceCtor.prototype[name];
        });
    });
}
var validateISODuration = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
/**
 * Indicates whether the given string is in ISO 8601 format.
 * @param value - The value to be validated for ISO 8601 duration format.
 * @returns `true` if valid, `false` otherwise.
 */
export function isDuration(value) {
    return validateISODuration.test(value);
}
/**
 * Replace all of the instances of searchValue in value with the provided replaceValue.
 * @param value - The value to search and replace in.
 * @param searchValue - The value to search for in the value argument.
 * @param replaceValue - The value to replace searchValue with in the value argument.
 * @returns The value where each instance of searchValue was replaced with replacedValue.
 */
export function replaceAll(value, searchValue, replaceValue) {
    return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
}
/**
 * Determines whether the given entity is a basic/primitive type
 * (string, number, boolean, null, undefined).
 * @param value - Any entity
 * @returns true is it is primitive type, false otherwise.
 */
export function isPrimitiveType(value) {
    return (typeof value !== "object" && typeof value !== "function") || value === null;
}
export function getEnvironmentValue(name) {
    if (process.env[name]) {
        return process.env[name];
    }
    else if (process.env[name.toLowerCase()]) {
        return process.env[name.toLowerCase()];
    }
    return undefined;
}
/**
 * @internal
 * @returns true when input is an object type that is not null, Array, RegExp, or Date.
 */
export function isObject(input) {
    return (typeof input === "object" &&
        input !== null &&
        !Array.isArray(input) &&
        !(input instanceof RegExp) &&
        !(input instanceof Date));
}
//# sourceMappingURL=utils.js.map
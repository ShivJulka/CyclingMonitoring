// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { URL } from "./url";
import { getOperationArgumentValueFromParameter } from "./operationHelpers";
import { getPathStringFromParameter } from "./interfaceHelpers";
const CollectionFormatToDelimiterMap = {
    CSV: ",",
    SSV: " ",
    Multi: "Multi",
    TSV: "\t",
    Pipes: "|"
};
export function getRequestUrl(baseUri, operationSpec, operationArguments, fallbackObject) {
    const urlReplacements = calculateUrlReplacements(operationSpec, operationArguments, fallbackObject);
    let requestUrl = replaceAll(baseUri, urlReplacements);
    if (operationSpec.path) {
        const path = replaceAll(operationSpec.path, urlReplacements);
        // QUIRK: sometimes we get a path component like {nextLink}
        // which may be a fully formed URL. In that case, we should
        // ignore the baseUri.
        if (isAbsoluteUrl(path)) {
            requestUrl = path;
        }
        else {
            requestUrl = appendPath(requestUrl, path);
        }
    }
    const { queryParams, sequenceParams } = calculateQueryParameters(operationSpec, operationArguments, fallbackObject);
    requestUrl = appendQueryParams(requestUrl, queryParams, sequenceParams);
    return requestUrl;
}
function replaceAll(input, replacements) {
    let result = input;
    for (const [searchValue, replaceValue] of replacements) {
        result = result.split(searchValue).join(replaceValue);
    }
    return result;
}
function calculateUrlReplacements(operationSpec, operationArguments, fallbackObject) {
    var _a;
    const result = new Map();
    if ((_a = operationSpec.urlParameters) === null || _a === void 0 ? void 0 : _a.length) {
        for (const urlParameter of operationSpec.urlParameters) {
            let urlParameterValue = getOperationArgumentValueFromParameter(operationArguments, urlParameter, fallbackObject);
            const parameterPathString = getPathStringFromParameter(urlParameter);
            urlParameterValue = operationSpec.serializer.serialize(urlParameter.mapper, urlParameterValue, parameterPathString);
            if (!urlParameter.skipEncoding) {
                urlParameterValue = encodeURIComponent(urlParameterValue);
            }
            result.set(`{${urlParameter.mapper.serializedName || parameterPathString}}`, urlParameterValue);
        }
    }
    return result;
}
function isAbsoluteUrl(url) {
    return url.includes("://");
}
function appendPath(url, pathToAppend) {
    if (!pathToAppend) {
        return url;
    }
    const parsedUrl = new URL(url);
    let newPath = parsedUrl.pathname;
    if (!newPath.endsWith("/")) {
        newPath = `${newPath}/`;
    }
    if (pathToAppend.startsWith("/")) {
        pathToAppend = pathToAppend.substring(1);
    }
    const searchStart = pathToAppend.indexOf("?");
    if (searchStart !== -1) {
        const path = pathToAppend.substring(0, searchStart);
        const search = pathToAppend.substring(searchStart + 1);
        newPath = newPath + path;
        if (search) {
            parsedUrl.search = parsedUrl.search ? `${parsedUrl.search}&${search}` : search;
        }
    }
    else {
        newPath = newPath + pathToAppend;
    }
    parsedUrl.pathname = newPath;
    return parsedUrl.toString();
}
function calculateQueryParameters(operationSpec, operationArguments, fallbackObject) {
    var _a;
    const result = new Map();
    const sequenceParams = new Set();
    if ((_a = operationSpec.queryParameters) === null || _a === void 0 ? void 0 : _a.length) {
        for (const queryParameter of operationSpec.queryParameters) {
            if (queryParameter.mapper.type.name === "Sequence" && queryParameter.mapper.serializedName) {
                sequenceParams.add(queryParameter.mapper.serializedName);
            }
            let queryParameterValue = getOperationArgumentValueFromParameter(operationArguments, queryParameter, fallbackObject);
            if ((queryParameterValue !== undefined && queryParameterValue !== null) ||
                queryParameter.mapper.required) {
                queryParameterValue = operationSpec.serializer.serialize(queryParameter.mapper, queryParameterValue, getPathStringFromParameter(queryParameter));
                const delimiter = queryParameter.collectionFormat
                    ? CollectionFormatToDelimiterMap[queryParameter.collectionFormat]
                    : "";
                if (Array.isArray(queryParameterValue)) {
                    // replace null and undefined
                    queryParameterValue = queryParameterValue.map((item) => {
                        if (item === null || item === undefined) {
                            return "";
                        }
                        return item;
                    });
                }
                if (queryParameter.collectionFormat === "Multi" && queryParameterValue.length === 0) {
                    continue;
                }
                else if (Array.isArray(queryParameterValue) &&
                    (queryParameter.collectionFormat === "SSV" || queryParameter.collectionFormat === "TSV")) {
                    queryParameterValue = queryParameterValue.join(delimiter);
                }
                if (!queryParameter.skipEncoding) {
                    if (Array.isArray(queryParameterValue)) {
                        queryParameterValue = queryParameterValue.map((item) => {
                            return encodeURIComponent(item);
                        });
                    }
                    else {
                        queryParameterValue = encodeURIComponent(queryParameterValue);
                    }
                }
                // Join pipes and CSV *after* encoding, or the server will be upset.
                if (Array.isArray(queryParameterValue) &&
                    (queryParameter.collectionFormat === "CSV" || queryParameter.collectionFormat === "Pipes")) {
                    queryParameterValue = queryParameterValue.join(delimiter);
                }
                result.set(queryParameter.mapper.serializedName || getPathStringFromParameter(queryParameter), queryParameterValue);
            }
        }
    }
    return {
        queryParams: result,
        sequenceParams
    };
}
function simpleParseQueryParams(queryString) {
    const result = new Map();
    if (!queryString || queryString[0] !== "?") {
        return result;
    }
    // remove the leading ?
    queryString = queryString.slice(1);
    const pairs = queryString.split("&");
    for (const pair of pairs) {
        const [name, value] = pair.split("=", 2);
        const existingValue = result.get(name);
        if (existingValue) {
            if (Array.isArray(existingValue)) {
                existingValue.push(value);
            }
            else {
                result.set(name, [existingValue, value]);
            }
        }
        else {
            result.set(name, value);
        }
    }
    return result;
}
/** @internal */
export function appendQueryParams(url, queryParams, sequenceParams) {
    if (queryParams.size === 0) {
        return url;
    }
    const parsedUrl = new URL(url);
    // QUIRK: parsedUrl.searchParams will have their name/value pairs decoded, which
    // can change their meaning to the server, such as in the case of a SAS signature.
    // To avoid accidentally un-encoding a query param, we parse the key/values ourselves
    const combinedParams = simpleParseQueryParams(parsedUrl.search);
    for (const [name, value] of queryParams) {
        const existingValue = combinedParams.get(name);
        if (Array.isArray(existingValue)) {
            if (Array.isArray(value)) {
                existingValue.push(...value);
                const valueSet = new Set(existingValue);
                combinedParams.set(name, Array.from(valueSet));
            }
            else {
                existingValue.push(value);
            }
        }
        else if (existingValue) {
            let newValue = value;
            if (Array.isArray(value)) {
                value.unshift(existingValue);
            }
            else if (sequenceParams.has(name)) {
                newValue = [existingValue, value];
            }
            combinedParams.set(name, newValue);
        }
        else {
            combinedParams.set(name, value);
        }
    }
    const searchPieces = [];
    for (const [name, value] of combinedParams) {
        if (typeof value === "string") {
            searchPieces.push(`${name}=${value}`);
        }
        else {
            // QUIRK: If we get an array of values, include multiple key/value pairs
            for (const subValue of value) {
                searchPieces.push(`${name}=${subValue}`);
            }
        }
    }
    // QUIRK: we have to set search manually as searchParams will encode comma when it shouldn't.
    parsedUrl.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";
    return parsedUrl.toString();
}
//# sourceMappingURL=urlHelpers.js.map
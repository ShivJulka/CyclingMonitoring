"use strict";
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Constants_1 = require("./Constants");
var ClientConfigurationError_1 = require("../error/ClientConfigurationError");
var ScopeSet_1 = require("../ScopeSet");
var StringUtils_1 = require("./StringUtils");
var CryptoUtils_1 = require("./CryptoUtils");
var TimeUtils_1 = require("./TimeUtils");
var ClientAuthError_1 = require("../error/ClientAuthError");
/**
 * @hidden
 */
var RequestUtils = /** @class */ (function () {
    function RequestUtils() {
    }
    /**
     * @ignore
     *
     * @param request
     * @param isLoginCall
     * @param cacheStorage
     * @param clientId
     *
     * validates all request parameters and generates a consumable request object
     */
    RequestUtils.validateRequest = function (request, isLoginCall, clientId, interactionType) {
        // Throw error if request is empty for acquire * calls
        if (!isLoginCall && !request) {
            throw ClientConfigurationError_1.ClientConfigurationError.createEmptyRequestError();
        }
        var scopes;
        var extraQueryParameters;
        if (request) {
            // if extraScopesToConsent is passed in loginCall, append them to the login request; Validate and filter scopes (the validate function will throw if validation fails)
            scopes = isLoginCall ? ScopeSet_1.ScopeSet.appendScopes(request.scopes, request.extraScopesToConsent) : request.scopes;
            ScopeSet_1.ScopeSet.validateInputScope(scopes, !isLoginCall);
            scopes = ScopeSet_1.ScopeSet.translateClientIdIfSingleScope(scopes, clientId);
            // validate prompt parameter
            this.validatePromptParameter(request.prompt);
            // validate extraQueryParameters
            extraQueryParameters = this.validateEQParameters(request.extraQueryParameters, request.claimsRequest);
            // validate claimsRequest
            this.validateClaimsRequest(request.claimsRequest);
        }
        // validate and generate state and correlationId
        var state = this.validateAndGenerateState(request && request.state, interactionType);
        var correlationId = this.validateAndGenerateCorrelationId(request && request.correlationId);
        var validatedRequest = tslib_1.__assign({}, request, { extraQueryParameters: extraQueryParameters,
            scopes: scopes,
            state: state,
            correlationId: correlationId });
        return validatedRequest;
    };
    /**
     * @ignore
     *
     * Utility to test if valid prompt value is passed in the request
     * @param request
     */
    RequestUtils.validatePromptParameter = function (prompt) {
        if (prompt) {
            if ([Constants_1.PromptState.LOGIN, Constants_1.PromptState.SELECT_ACCOUNT, Constants_1.PromptState.CONSENT, Constants_1.PromptState.NONE].indexOf(prompt) < 0) {
                throw ClientConfigurationError_1.ClientConfigurationError.createInvalidPromptError(prompt);
            }
        }
    };
    /**
     * @ignore
     *
     * Removes unnecessary or duplicate query parameters from extraQueryParameters
     * @param request
     */
    RequestUtils.validateEQParameters = function (extraQueryParameters, claimsRequest) {
        var eQParams = tslib_1.__assign({}, extraQueryParameters);
        if (!eQParams) {
            return null;
        }
        if (claimsRequest) {
            // this.logger.warning("Removed duplicate claims from extraQueryParameters. Please use either the claimsRequest field OR pass as extraQueryParameter - not both.");
            delete eQParams[Constants_1.Constants.claims];
        }
        Constants_1.BlacklistedEQParams.forEach(function (param) {
            if (eQParams[param]) {
                // this.logger.warning("Removed duplicate " + param + " from extraQueryParameters. Please use the " + param + " field in request object.");
                delete eQParams[param];
            }
        });
        return eQParams;
    };
    /**
     * @ignore
     *
     * Validates the claims passed in request is a JSON
     * TODO: More validation will be added when the server team tells us how they have actually implemented claims
     * @param claimsRequest
     */
    RequestUtils.validateClaimsRequest = function (claimsRequest) {
        if (!claimsRequest) {
            return;
        }
        try {
            JSON.parse(claimsRequest);
        }
        catch (e) {
            throw ClientConfigurationError_1.ClientConfigurationError.createClaimsRequestParsingError(e);
        }
    };
    /**
     * @ignore
     *
     * generate unique state per request
     * @param userState User-provided state value
     * @returns State string include library state and user state
     */
    RequestUtils.validateAndGenerateState = function (userState, interactionType) {
        return !StringUtils_1.StringUtils.isEmpty(userState) ? "" + RequestUtils.generateLibraryState(interactionType) + Constants_1.Constants.resourceDelimiter + userState : RequestUtils.generateLibraryState(interactionType);
    };
    /**
     * Generates the state value used by the library.
     *
     * @returns Base64 encoded string representing the state
     */
    RequestUtils.generateLibraryState = function (interactionType) {
        var stateObject = {
            id: CryptoUtils_1.CryptoUtils.createNewGuid(),
            ts: TimeUtils_1.TimeUtils.now(),
            method: interactionType
        };
        var stateString = JSON.stringify(stateObject);
        return CryptoUtils_1.CryptoUtils.base64Encode(stateString);
    };
    /**
     * Decodes the state value into a StateObject
     *
     * @param state State value returned in the request
     * @returns Parsed values from the encoded state value
     */
    RequestUtils.parseLibraryState = function (state) {
        var libraryState = decodeURIComponent(state).split(Constants_1.Constants.resourceDelimiter)[0];
        if (CryptoUtils_1.CryptoUtils.isGuid(libraryState)) {
            // If state is guid, assume timestamp is now and is redirect, as redirect should be only method where this can happen.
            return {
                id: libraryState,
                ts: TimeUtils_1.TimeUtils.now(),
                method: Constants_1.Constants.interactionTypeRedirect
            };
        }
        try {
            var stateString = CryptoUtils_1.CryptoUtils.base64Decode(libraryState);
            var stateObject = JSON.parse(stateString);
            return stateObject;
        }
        catch (e) {
            throw ClientAuthError_1.ClientAuthError.createInvalidStateError(state, null);
        }
    };
    /**
     * @ignore
     *
     * validate correlationId and generate if not valid or not set by the user
     * @param correlationId
     */
    RequestUtils.validateAndGenerateCorrelationId = function (correlationId) {
        // validate user set correlationId or set one for the user if null
        if (correlationId && !CryptoUtils_1.CryptoUtils.isGuid(correlationId)) {
            throw ClientConfigurationError_1.ClientConfigurationError.createInvalidCorrelationIdError();
        }
        return CryptoUtils_1.CryptoUtils.isGuid(correlationId) ? correlationId : CryptoUtils_1.CryptoUtils.createNewGuid();
    };
    /**
     * Create a request signature
     * @param request
     */
    RequestUtils.createRequestSignature = function (request) {
        return "" + request.scopes.join(" ").toLowerCase() + Constants_1.Constants.resourceDelimiter + request.authority;
    };
    return RequestUtils;
}());
exports.RequestUtils = RequestUtils;
//# sourceMappingURL=RequestUtils.js.map
/*! @azure/msal-common v4.4.0 2021-06-29 */
'use strict';
import { __extends, __awaiter, __generator } from '../_virtual/_tslib.js';
import { BaseClient } from './BaseClient.js';
import { ScopeSet } from '../request/ScopeSet.js';
import { AuthToken } from '../account/AuthToken.js';
import { TimeUtils } from '../utils/TimeUtils.js';
import { RefreshTokenClient } from './RefreshTokenClient.js';
import { ClientAuthError, ClientAuthErrorMessage } from '../error/ClientAuthError.js';
import { ClientConfigurationError } from '../error/ClientConfigurationError.js';
import { ResponseHandler } from '../response/ResponseHandler.js';
import { AuthenticationScheme } from '../utils/Constants.js';
import { StringUtils } from '../utils/StringUtils.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var SilentFlowClient = /** @class */ (function (_super) {
    __extends(SilentFlowClient, _super);
    function SilentFlowClient(configuration) {
        return _super.call(this, configuration) || this;
    }
    /**
     * Retrieves a token from cache if it is still valid, or uses the cached refresh token to renew
     * the given token and returns the renewed token
     * @param request
     */
    SilentFlowClient.prototype.acquireToken = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, refreshTokenClient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.acquireCachedToken(request)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1 instanceof ClientAuthError && e_1.errorCode === ClientAuthErrorMessage.tokenRefreshRequired.code) {
                            refreshTokenClient = new RefreshTokenClient(this.config);
                            return [2 /*return*/, refreshTokenClient.acquireTokenByRefreshToken(request)];
                        }
                        else {
                            throw e_1;
                        }
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves token from cache or throws an error if it must be refreshed.
     * @param request
     */
    SilentFlowClient.prototype.acquireCachedToken = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var requestScopes, environment, authScheme, cacheRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Cannot renew token if no request object is given.
                        if (!request) {
                            throw ClientConfigurationError.createEmptyTokenRequestError();
                        }
                        // We currently do not support silent flow for account === null use cases; This will be revisited for confidential flow usecases
                        if (!request.account) {
                            throw ClientAuthError.createNoAccountInSilentRequestError();
                        }
                        requestScopes = new ScopeSet(request.scopes || []);
                        environment = request.authority || this.authority.getPreferredCache();
                        authScheme = request.authenticationScheme || AuthenticationScheme.BEARER;
                        cacheRecord = this.cacheManager.readCacheRecord(request.account, this.config.authOptions.clientId, requestScopes, environment, authScheme);
                        if (request.forceRefresh ||
                            !StringUtils.isEmptyObj(request.claims) ||
                            !cacheRecord.accessToken ||
                            TimeUtils.isTokenExpired(cacheRecord.accessToken.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds) ||
                            TimeUtils.wasClockTurnedBack(cacheRecord.accessToken.cachedAt) ||
                            (cacheRecord.accessToken.refreshOn && TimeUtils.isTokenExpired(cacheRecord.accessToken.refreshOn, 0))) {
                            // Must refresh due to request parameters, or expired or non-existent access_token
                            throw ClientAuthError.createRefreshRequiredError();
                        }
                        if (this.config.serverTelemetryManager) {
                            this.config.serverTelemetryManager.incrementCacheHits();
                        }
                        return [4 /*yield*/, this.generateResultFromCacheRecord(cacheRecord, request)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Helper function to build response object from the CacheRecord
     * @param cacheRecord
     */
    SilentFlowClient.prototype.generateResultFromCacheRecord = function (cacheRecord, request) {
        return __awaiter(this, void 0, void 0, function () {
            var idTokenObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (cacheRecord.idToken) {
                            idTokenObj = new AuthToken(cacheRecord.idToken.secret, this.config.cryptoInterface);
                        }
                        return [4 /*yield*/, ResponseHandler.generateAuthenticationResult(this.cryptoUtils, this.authority, cacheRecord, true, request, idTokenObj)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SilentFlowClient;
}(BaseClient));

export { SilentFlowClient };
//# sourceMappingURL=SilentFlowClient.js.map

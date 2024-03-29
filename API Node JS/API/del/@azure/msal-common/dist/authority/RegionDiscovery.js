/*! @azure/msal-common v4.4.0 2021-06-29 */
'use strict';
import { __awaiter, __generator } from '../_virtual/_tslib.js';
import { ResponseCodes, Constants } from '../utils/Constants.js';

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var RegionDiscovery = /** @class */ (function () {
    function RegionDiscovery(networkInterface) {
        this.networkInterface = networkInterface;
    }
    /**
     * Detect the region from the application's environment.
     *
     * @returns Promise<string | null>
     */
    RegionDiscovery.prototype.detectRegion = function (environmentRegion) {
        return __awaiter(this, void 0, void 0, function () {
            var autodetectedRegionName, response, latestIMDSVersion, response_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        autodetectedRegionName = environmentRegion;
                        if (!!autodetectedRegionName) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.getRegionFromIMDS(Constants.IMDS_VERSION)];
                    case 2:
                        response = _a.sent();
                        if (response.status === ResponseCodes.httpSuccess) {
                            autodetectedRegionName = response.body;
                        }
                        if (!(response.status === ResponseCodes.httpBadRequest)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getCurrentVersion()];
                    case 3:
                        latestIMDSVersion = _a.sent();
                        if (!latestIMDSVersion) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getRegionFromIMDS(latestIMDSVersion)];
                    case 4:
                        response_1 = _a.sent();
                        if (response_1.status === ResponseCodes.httpSuccess) {
                            autodetectedRegionName = response_1.body;
                        }
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 7: return [2 /*return*/, autodetectedRegionName || null];
                }
            });
        });
    };
    /**
     * Make the call to the IMDS endpoint
     *
     * @param imdsEndpointUrl
     * @returns Promise<NetworkResponse<string>>
     */
    RegionDiscovery.prototype.getRegionFromIMDS = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.networkInterface.sendGetRequestAsync(Constants.IMDS_ENDPOINT + "?api-version=" + version + "&format=text", RegionDiscovery.IMDS_OPTIONS, Constants.IMDS_TIMEOUT)];
            });
        });
    };
    /**
     * Get the most recent version of the IMDS endpoint available
     *
     * @returns Promise<string | null>
     */
    RegionDiscovery.prototype.getCurrentVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.networkInterface.sendGetRequestAsync(Constants.IMDS_ENDPOINT + "?format=json", RegionDiscovery.IMDS_OPTIONS)];
                    case 1:
                        response = _a.sent();
                        // When IMDS endpoint is called without the api version query param, bad request response comes back with latest version.
                        if (response.status === ResponseCodes.httpBadRequest && response.body && response.body["newest-versions"] && response.body["newest-versions"].length > 0) {
                            return [2 /*return*/, response.body["newest-versions"][0]];
                        }
                        return [2 /*return*/, null];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Options for the IMDS endpoint request
    RegionDiscovery.IMDS_OPTIONS = { headers: { "Metadata": "true" } };
    return RegionDiscovery;
}());

export { RegionDiscovery };
//# sourceMappingURL=RegionDiscovery.js.map

/*! @azure/msal-common v4.4.0 2021-06-29 */
'use strict';
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function isCloudInstanceDiscoveryResponse(response) {
    return (response.hasOwnProperty("tenant_discovery_endpoint") &&
        response.hasOwnProperty("metadata"));
}

export { isCloudInstanceDiscoveryResponse };
//# sourceMappingURL=CloudInstanceDiscoveryResponse.js.map

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * The different levels of logs that can be used with the HttpPipelineLogger.
 */
export var HttpPipelineLogLevel;
(function (HttpPipelineLogLevel) {
    /**
     * A log level that indicates that no logs will be logged.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["OFF"] = 0] = "OFF";
    /**
     * An error log.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["ERROR"] = 1] = "ERROR";
    /**
     * A warning log.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["WARNING"] = 2] = "WARNING";
    /**
     * An information log.
     */
    HttpPipelineLogLevel[HttpPipelineLogLevel["INFO"] = 3] = "INFO";
})(HttpPipelineLogLevel || (HttpPipelineLogLevel = {}));
//# sourceMappingURL=httpPipelineLogLevel.js.map
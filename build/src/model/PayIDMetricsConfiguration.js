"use strict";
/**
 * This is a derivative work of https://github.com/payid-org/payid/blob/master/src/config.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayIDMetricsConfiguration = void 0;
class PayIDMetricsConfiguration {
    constructor(tag, organization) {
        /** URL to a Prometheus push gateway, defaulting to the Xpring Prometheus server. */
        this.gatewayUrl = 'https://push00.mon.payid.tech/';
        /** How frequently (in seconds) to push metrics to the Prometheus push gateway. */
        this.pushIntervalInSeconds = 15;
        /** How frequently (in seconds) to refresh the PayID Count report data from the database. */
        this.payIdCountRefreshIntervalInSeconds = 60;
        this.tag = tag;
        this.organization = organization;
    }
}
exports.PayIDMetricsConfiguration = PayIDMetricsConfiguration;
//# sourceMappingURL=PayIDMetricsConfiguration.js.map
/**
 * This is a derivative work of https://github.com/payid-org/payid/blob/master/src/services/metrics.ts
 *
 *
 */
import { PayIDMetricsConfiguration } from "../model/PayIDMetricsConfiguration";
import { Counter, Gauge, Registry } from 'prom-client';
export declare class PayIDMetricsService {
    constructor(metricsConfig: PayIDMetricsConfiguration);
    interval?: ReturnType<typeof setInterval>;
    metricsConfig: PayIDMetricsConfiguration;
    payIdLookupCounterRegistry: Registry;
    payIdGaugeRegistry: Registry;
    /** Prometheus Counter reporting the number of PayID lookups by [network, environment, org, result]. */
    payIdLookupCounter: Counter<"paymentNetwork" | "environment" | "org" | "result">;
    /** Prometheus Gauge for reporting the current count of PayIDs by [network, environment, org]. */
    payIdGauge: Gauge<"paymentNetwork" | "environment" | "org">;
    /**
     * Attempt to schedule a recurring metrics push to the metrics gateway URL.
     * Configured through the environment/defaults set in the PayID
     * app config.
     *
     * @returns A timer object if push metrics are enabled, undefined otherwise.
     */
    scheduleRecurringMetricsPush(): void;
    isPushMetricsEnabled(): boolean;
    /**
     * Record a PayID lookup that failed due to a bad accept header.
     */
    recordPayIdLookupBadAcceptHeader(): void;
    /**
     * Set the PayID count for a given [paymentNetwork, environment] tuple.
     *
     * Used when calculating the total count of PayIDs for this server.
     *
     * @param paymentNetwork - The payment network of the address.
     * @param environment - The environment of the address.
     * @param count - The current count.
     */
    setPayIdCount(paymentNetwork: string, environment: string, count: number): void;
    /**
     * Increment a Prometheus Counter for every PayID lookup (public API).
     *
     * Segregated by whether the lookup was successful or not, and [paymentNetwork, environment].
     *
     * @param found - Whether the PayID lookup was successful or not.
     * @param paymentNetwork - The payment network of the lookup.
     * @param environment - The environment of the lookup.
     */
    recordPayIdLookupResult(found: boolean, paymentNetwork: string, environment?: string): void;
}
//# sourceMappingURL=PayIDMetricsService.d.ts.map
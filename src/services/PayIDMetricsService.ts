/**
 * This is a derivative work of https://github.com/payid-org/payid/blob/master/src/services/metrics.ts
 *
 */

import { PayIDMetricsConfiguration } from '../model/PayIDMetricsConfiguration';
import { Counter, Gauge, Pushgateway, Registry } from 'prom-client';

export class PayIDMetricsService {
  constructor(metricsConfig: PayIDMetricsConfiguration) {
    this.metricsConfig = metricsConfig;
  }

  interval?: ReturnType<typeof setInterval>;
  metricsConfig: PayIDMetricsConfiguration;
  payIdLookupCounterRegistry = new Registry();
  payIdGaugeRegistry = new Registry();
  /** Prometheus Counter reporting the number of PayID lookups by [network, environment, org, result]. */
  payIdLookupCounter = new Counter({
    name: 'payid_lookup_request',
    help: 'count of requests to lookup a PayID',
    labelNames: ['paymentNetwork', 'environment', 'org', 'result'],
    registers: [this.payIdLookupCounterRegistry],
  });

  /** Prometheus Gauge for reporting the current count of PayIDs by [network, environment, org]. */
  payIdGauge = new Gauge({
    name: 'payid_count',
    help: 'count of total PayIDs',
    labelNames: ['paymentNetwork', 'environment', 'org'],
    registers: [this.payIdGaugeRegistry],
  });

  /**
   * Attempt to schedule a recurring metrics push to the metrics gateway URL.
   * Configured through the environment/defaults set in the PayID
   * app config.
   *
   * @returns A timer object if push metrics are enabled, undefined otherwise.
   */
  scheduleRecurringMetricsPush(): void {
    if (!this.isPushMetricsEnabled()) {
      return;
    }
    if (typeof this.interval !== 'undefined' && this.interval !== null) {
      clearInterval(this.interval);
    }

    const payIdLookupCounterGateway = new Pushgateway(
      this.metricsConfig.gatewayUrl,
      [],
      this.payIdLookupCounterRegistry,
    );

    const payIdGaugeGateway = new Pushgateway(this.metricsConfig.gatewayUrl, [], this.payIdGaugeRegistry);

    this.interval = setInterval(() => {
      // Use 'pushAdd' because counts are additive. You want all values over time from multiple servers.
      // You don’t want the lookup count on one server to overwrite the running totals.
      payIdLookupCounterGateway.pushAdd(
        {
          jobName: 'payid_counter_metrics',
          groupings: {
            instance: `${this.metricsConfig.organization as string}_${this.metricsConfig.tag as string}`,
          },
        },
        (err, _resp, _body): void => {
          if (err) {
            console.log('counter metrics push failed with ', err);
          }
        },
      );

      // Use push because we want the value to overwrite (only care about the current PayID count)
      payIdGaugeGateway.push(
        {
          jobName: 'payid_gauge_metrics',
          groupings: {
            instance: this.metricsConfig.organization as string,
          },
        },
        (err, _resp, _body): void => {
          if (err) {
            console.log('gauge metrics push failed with ', err);
          }
        },
      );
    }, this.metricsConfig.pushIntervalInSeconds * 1000);
  }

  isPushMetricsEnabled(): boolean {
    // TODO:(hbergren) Maybe check that this is actually a valid url as well using Node.URL
    if (!this.metricsConfig.gatewayUrl) {
      console.log('PUSH_GATEWAY_URL must be set for metrics to be pushed. Metrics will not be pushed.');
      return false;
    }

    if (!this.metricsConfig.organization) {
      console.log('PAYID_ORG must be set for metrics to be pushed. Metrics will not be pushed.');
      return false;
    }

    if (this.metricsConfig.pushIntervalInSeconds <= 0 || Number.isNaN(this.metricsConfig.pushIntervalInSeconds)) {
      console.log(
        `Invalid PUSH_METRICS_INTERVAL value: ${this.metricsConfig.pushIntervalInSeconds}. Metrics will not be pushed.`,
      );
      return false;
    }

    return true;
  }

  /**
   * Record a PayID lookup that failed due to a bad accept header.
   */
  recordPayIdLookupBadAcceptHeader(): void {
    // TODO:(hbergren) Would we ever want to record the bad accept header here?
    this.payIdLookupCounter.inc(
      {
        paymentNetwork: 'unknown',
        environment: 'unknown',
        org: this.metricsConfig.organization,
        result: 'error: bad_accept_header',
      },
      1,
    );
  }

  /**
   * Set the PayID count for a given [paymentNetwork, environment] tuple.
   *
   * Used when calculating the total count of PayIDs for this server.
   *
   * @param paymentNetwork - The payment network of the address.
   * @param environment - The environment of the address.
   * @param count - The current count.
   */
  setPayIdCount(paymentNetwork: string, environment: string, count: number): void {
    this.payIdGauge.set(
      {
        paymentNetwork,
        environment,
        org: this.metricsConfig.organization,
      },
      count,
    );
  }

  /**
   * Increment a Prometheus Counter for every PayID lookup (public API).
   *
   * Segregated by whether the lookup was successful or not, and [paymentNetwork, environment].
   *
   * @param found - Whether the PayID lookup was successful or not.
   * @param paymentNetwork - The payment network of the lookup.
   * @param environment - The environment of the lookup.
   */
  recordPayIdLookupResult(found: boolean, paymentNetwork: string, environment = 'null'): void {
    this.payIdLookupCounter.inc(
      {
        paymentNetwork,
        environment,
        org: this.metricsConfig.organization,
        result: found ? 'found' : 'not_found',
      },
      1,
    );
  }
}

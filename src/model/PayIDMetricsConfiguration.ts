/**
 * This is a derivative work of https://github.com/payid-org/payid/blob/master/src/config.ts
 */

export class PayIDMetricsConfiguration {
  constructor(tag: string, organization: string) {
    this.tag = tag;
    this.organization = organization;
  }

  /**
   * Some unique identifier of the process across your entire deployment.  Could be a combination of hostname+'_'+pid
   */
  tag: string;

  /**
   * Name of the individual or organization that operates this PayID server.
   * Used to identify who is pushing the metrics in cases where multiple PayID servers are pushing to a shared metrics server.
   * Required for pushing metrics.
   */
  organization: string;

  /** URL to a Prometheus push gateway, defaulting to the Xpring Prometheus server. */
  gatewayUrl: string = 'https://push00.mon.payid.tech/';

  /** How frequently (in seconds) to push metrics to the Prometheus push gateway. */
  pushIntervalInSeconds: number = 15;

  /** How frequently (in seconds) to refresh the PayID Count report data from the database. */
  payIdCountRefreshIntervalInSeconds: number = 60;
}

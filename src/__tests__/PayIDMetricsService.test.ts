import {PayIDMetricsConfiguration, PayIDMetricsService} from '../index';
test('Test Default Interval Seconds', () => {
    const metricsConfig = new PayIDMetricsConfiguration('tag1', 'payburner.com');
    expect(new Number(metricsConfig.payIdCountRefreshIntervalInSeconds).toFixed(0)).toBe("60");
});

test('Test Set Value', () => {
    const metricsConfig = new PayIDMetricsConfiguration('tag1', 'payburner.com');
    const metricsService = new PayIDMetricsService(metricsConfig);
    metricsService.setPayIdCount('XRPL', 'MAINNET', 1);
});
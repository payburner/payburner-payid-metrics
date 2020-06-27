import { PayIDMetricsConfiguration} from '../index';
test('My Greeter', () => {
    const metricsConfig = new PayIDMetricsConfiguration('tag1', 'payburner.com');
    expect(new Number(metricsConfig.payIdCountRefreshIntervalInSeconds)).toBe(Number(15));
});
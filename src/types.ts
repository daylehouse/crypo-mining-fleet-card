export interface CryptoMinerCardConfig {
  type?: string;
  title?: string;
  online_miners_entity?: string;
  offline_miners_entity?: string;
  fleet_power_entity?: string;
  fleet_energy_efficiency_entity?: string;
  btc_rate_entity?: string;
  bch_rate_entity?: string;
  ltc_rate_entity?: string;
  aleo_rate_entity?: string;
  solo_pool_hashrate_entity?: string;
  fleet_hashrate_chart_entity?: string;
  efficiency_chart_entity?: string;
  chart_span_minutes?: number;
  efficiency_chart_span_minutes?: number;
}

interface HomeAssistantConnection {
  sendMessagePromise<T = unknown>(message: unknown): Promise<T>;
}

export interface HomeAssistantLike {
  states: Record<string, { state: string; attributes?: Record<string, unknown> }>;
  entities: Record<string, unknown>;
  connection?: HomeAssistantConnection;
}

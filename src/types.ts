export interface CryptoMinerCardConfig {
  type?: string;
  title?: string;
  online_miners_entity?: string;
  offline_miners_entity?: string;
  fleet_power_entity?: string;
  fleet_energy_efficiency_entity?: string;
}

export interface HomeAssistantLike {
  states: Record<string, { state: string }>;
  entities: Record<string, unknown>;
}

export interface CryptoMinerCardConfig {
  type?: string;
  title?: string;
  online_miners_entity?: string;
  offline_miners_entity?: string;
}

export interface HomeAssistantLike {
  states: Record<string, { state: string }>;
  entities: Record<string, unknown>;
}

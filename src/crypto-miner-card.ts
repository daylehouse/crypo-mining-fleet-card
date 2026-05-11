import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseImage from "./baselayer.png";
import alienRegular from "./Alien-Encounters-Solid-Regular.ttf";
import alienBold from "./Alien-Encounters-Solid-Bold.ttf";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";

// Inject @font-face into document head so fonts work across Shadow DOM boundaries
if (!document.getElementById("crypto-miner-card-fonts")) {
  const style = document.createElement("style");
  style.id = "crypto-miner-card-fonts";
  style.textContent = `
    @font-face {
      font-family: "AlienEncountersRegular";
      src: url("${alienRegular}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "AlienEncountersBold";
      src: url("${alienBold}") format("truetype");
      font-weight: 700;
      font-style: normal;
    }
  `;
  document.head.appendChild(style);
}

@customElement("crypto-miner-card")
export class CryptoMinerCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistantLike;
  private _config?: CryptoMinerCardConfig;

  setConfig(config: CryptoMinerCardConfig) {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      throw new Error("Invalid configuration");
    }

    this._config = config;
  }

  getCardSize(): number {
    return 5;
  }

  getGridOptions() {
    return {
      rows: 5,
      min_rows: 3,
      columns: 12
    };
  }

  static getStubConfig(): Omit<CryptoMinerCardConfig, "type"> {
    return {
      online_miners_entity: "sensor.online_miners",
      offline_miners_entity: "sensor.miners_offline",
      fleet_power_entity: "sensor.fleet_power",
      fleet_energy_efficiency_entity: "sensor.fleet_energy_efficiency",
      btc_rate_entity: "sensor.btc_rate",
      bch_rate_entity: "sensor.bch_rate",
      ltc_rate_entity: "sensor.ltc_rate",
      aleo_rate_entity: "sensor.aleo_rate",
      solo_pool_hashrate_entity: "sensor.solo_pool_hashrate"
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "title",
          selector: { text: {} }
        },
        {
          name: "online_miners_entity",
          selector: { entity: {} }
        },
        {
          name: "fleet_energy_efficiency_entity",
          selector: { entity: {} }
        },
        {
          name: "fleet_power_entity",
          selector: { entity: {} }
        },
        {
          name: "offline_miners_entity",
          selector: { entity: {} }
        },
        {
          name: "btc_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "bch_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "ltc_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "aleo_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "solo_pool_hashrate_entity",
          selector: { entity: {} }
        }
      ],
      computeLabel: (schema: { name: string }) => {
        if (schema.name === "title") {
          return "Card Title";
        }
        if (schema.name === "online_miners_entity") {
          return "Online Miners Entity";
        }
        if (schema.name === "fleet_energy_efficiency_entity") {
          return "Energy Efficiency Entity";
        }
        if (schema.name === "fleet_power_entity") {
          return "Power Entity";
        }
        if (schema.name === "offline_miners_entity") {
          return "Miners Offline Entity";
        }
        if (schema.name === "btc_rate_entity") {
          return "BTC Rate Entity";
        }
        if (schema.name === "bch_rate_entity") {
          return "BCH Rate Entity";
        }
        if (schema.name === "ltc_rate_entity") {
          return "LTC Rate Entity";
        }
        if (schema.name === "aleo_rate_entity") {
          return "ALEO Rate Entity";
        }
        if (schema.name === "solo_pool_hashrate_entity") {
          return "Solo Pool Hashrate Entity";
        }
        return undefined;
      },
      computeHelper: (schema: { name: string }) => {
        if (schema.name === "title") {
          return "Optional title displayed at the top of the card";
        }
        if (schema.name === "online_miners_entity") {
          return "Select the entity to display as Online Miners";
        }
        if (schema.name === "fleet_energy_efficiency_entity") {
          return "Select the entity to display as Energy Efficiency";
        }
        if (schema.name === "fleet_power_entity") {
          return "Select the entity to display as Power";
        }
        if (schema.name === "offline_miners_entity") {
          return "Select the entity to display as Miners Offline";
        }
        if (schema.name === "btc_rate_entity") {
          return "Select the entity to display as BTC Rate";
        }
        if (schema.name === "bch_rate_entity") {
          return "Select the entity to display as BCH Rate";
        }
        if (schema.name === "ltc_rate_entity") {
          return "Select the entity to display as LTC Rate";
        }
        if (schema.name === "aleo_rate_entity") {
          return "Select the entity to display as ALEO Rate";
        }
        if (schema.name === "solo_pool_hashrate_entity") {
          return "Select the entity to display as Solo Pool Hashrate";
        }
        return undefined;
      }
    };
  }

  private _getEntityState(entityId?: string): string {
    if (!entityId) {
      return "--";
    }

    const state = this.hass?.states?.[entityId]?.state;
    if (state === undefined || state === null) {
      return "n/a";
    }

    return state;
  }

  private _getEntityStateWithUnit(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    if (!entityId) {
      return state;
    }

    const unit = this.hass?.states?.[entityId]?.attributes?.unit_of_measurement;
    if (typeof unit === "string" && unit.trim().length > 0) {
      return `${state} ${unit}`;
    }

    return state;
  }

  private _formatPowerState(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    const numericState = Number(state);
    if (!Number.isFinite(numericState)) {
      return this._getEntityStateWithUnit(entityId);
    }

    if (numericState >= 1000) {
      const kiloWatts = numericState / 1000;
      return `${kiloWatts.toFixed(1)} kW`;
    }

    return `${Math.round(numericState)} W`;
  }

  private _formatEfficiencyState(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    const numericState = Number(state);
    if (!Number.isFinite(numericState)) {
      return this._getEntityStateWithUnit(entityId);
    }

    return `${numericState.toFixed(2)} J/TH`;
  }

  protected render() {
    const title = this._config?.title?.trim() || "Crypto Mining Fleet";

    return html`
      <ha-card>
        <div class="card-shell">
          <img class="card-image" src=${baseImage} alt="Crypto miner card image" />
          <div class="stage-layer">
            <div class="card-title stage-item">${title}</div>

            <div class="sensor-chip stage-item hud-online">
              <ha-icon class="chip-icon chip-icon-online" icon="mdi:account-hard-hat"></ha-icon>
              <span class="chip-label">Online:</span>
              <span class="chip-value">${this._getEntityState(this._config?.online_miners_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-efficiency">
              <ha-icon class="chip-icon chip-icon-efficiency" icon="mdi:leaf"></ha-icon>
              <span class="chip-label">Efficiency</span>
              <span class="chip-value">${this._formatEfficiencyState(this._config?.fleet_energy_efficiency_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-power">
              <ha-icon class="chip-icon chip-icon-power" icon="mdi:power"></ha-icon>
              <span class="chip-label">Total</span>
              <span class="chip-value">${this._formatPowerState(this._config?.fleet_power_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-offline">
              <ha-icon class="chip-icon chip-icon-offline" icon="mdi:account-hard-hat"></ha-icon>
              <span class="chip-label">Offline:</span>
              <span class="chip-value">${this._getEntityState(this._config?.offline_miners_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-btc-rate">
              <div class="chip-rate-head">
                <span class="chip-label">BTC Hashrate</span>
              </div>
              <span class="chip-value">${this._getEntityStateWithUnit(this._config?.btc_rate_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-bch-rate">
              <div class="chip-rate-head">
                <span class="chip-label">BCH Hashrate</span>
              </div>
              <span class="chip-value">${this._getEntityStateWithUnit(this._config?.bch_rate_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-ltc-rate">
              <div class="chip-rate-head">
                <span class="chip-label">LTC Hashrate</span>
              </div>
              <span class="chip-value">${this._getEntityStateWithUnit(this._config?.ltc_rate_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-aleo-rate">
              <div class="chip-rate-head">
                <span class="chip-label">ALEO Hashrate</span>
              </div>
              <span class="chip-value">${this._getEntityStateWithUnit(this._config?.aleo_rate_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-solo-pool-hashrate">
              <div class="chip-rate-head">
                <span class="chip-label">Solo Pool</span>
              </div>
              <span class="chip-value">${this._getEntityStateWithUnit(this._config?.solo_pool_hashrate_entity)}</span>
            </div>

            <div class="miners-title stage-item">Miners</div>
            <div class="fleet-power-title stage-item">Fleet Power</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        margin: 0;
        padding: 0;
        display: block;
        font-family: "AlienEncountersRegular", sans-serif;
      }

      ha-card {
        padding: 0;
        overflow: hidden;
      }

      .card-shell {
        position: relative;
        overflow: hidden;
        aspect-ratio: 16 / 18.9;
      }

      .card-image {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 35%;
      }

      .stage-layer {
        position: absolute;
        inset: 0;
        background: transparent;
        pointer-events: none;
      }

      .stage-item {
        pointer-events: auto;
        z-index: 2;
      }

      .card-title {
        position: absolute;
        top: 9%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        padding: 6px 12px;
        color: #fff;
        font-size: 0.8rem;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        background: transparent;
        border: none;
      }

      .sensor-chip {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        background: transparent;
        color: #fff;
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 0.927rem;
        line-height: 1;
        transform: translate(-50%, -50%);
        border: none;
      }

      .chip-label {
        opacity: 0.9;
        font-family: "AlienEncountersRegular", sans-serif;
      }

      .chip-icon {
        font-size: 1.105rem;
        --mdc-icon-size: 1.105rem;
        line-height: 1;
      }

      .chip-icon-online {
        color: #39ff14;
      }

      .chip-icon-offline {
        color: #ff2bd6;
      }

      .chip-icon-efficiency {
        color: #00f5ff;
      }

      .chip-icon-power {
        color: #f8ff00;
      }

      .hud-btc-rate,
      .hud-bch-rate,
      .hud-ltc-rate,
      .hud-aleo-rate,
      .hud-solo-pool-hashrate {
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 20%;
        padding: 0;
        font-size: 0.74rem;
        line-height: 1.15;
        text-align: center;
      }

      .chip-rate-head {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .hud-btc-rate .chip-value,
      .hud-bch-rate .chip-value,
      .hud-ltc-rate .chip-value,
      .hud-aleo-rate .chip-value,
      .hud-solo-pool-hashrate .chip-value {
        margin-left: 0;
        width: 100%;
        text-align: center;
      }

      .fleet-power-title {
        position: absolute;
        top: 59%;
        left: 71%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 1.134rem;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        background: transparent;
        border: none;
        white-space: nowrap;
      }

      .miners-title {
        position: absolute;
        top: 59%;
        left: 30%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 1.134rem;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        background: transparent;
        border: none;
        white-space: nowrap;
      }

      .chip-value {
        margin-left: 2px;
        text-align: left;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
      }

      .hud-online {
        top: 64%;
        left: 29%;
      }

      .hud-efficiency {
        top: 64%;
        left: 70%;
      }

      .hud-power {
        top: 70%;
        left: 70%;
      }

      .hud-offline {
        top: 70%;
        left: 29%;
      }

      .hud-btc-rate {
        top: 42.5%;
        left: 23%;
      }

      .hud-bch-rate {
        top: 48%;
        left: 23%;
      }

      .hud-ltc-rate {
        top: 42.5%;
        left: 77%;
      }

      .hud-aleo-rate {
        top: 48%;
        left: 77%;
      }

      .hud-solo-pool-hashrate {
        top: 45.25%;
        left: 50%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "crypto-miner-card": CryptoMinerCard;
  }

  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview: boolean;
      documentationURL: string;
    }>;
  }
}

console.info("%c  CRYPTO-MINER-CARD  %c  v0.1.0  ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: "crypto-miner-card",
  name: "Crypto Miner Card",
  description: "Custom card for monitoring crypto miner fleet",
  preview: true,
  documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/"
});

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseImage from "./baselayer.png";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";

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
      fleet_energy_efficiency_entity: "sensor.fleet_energy_efficiency"
    };
  }

  static getConfigForm() {
    return {
      schema: [
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
        }
      ],
      computeLabel: (schema: { name: string }) => {
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
        return undefined;
      },
      computeHelper: (schema: { name: string }) => {
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

  protected render() {
    return html`
      <ha-card>
        <div class="card-shell">
          <img class="card-image" src=${baseImage} alt="Crypto miner card image" />
          <div class="stage-layer">
            <div class="positioning-overlay" aria-hidden="true"></div>

            <div class="sensor-chip stage-item hud-online">
              <span class="chip-prefix chip-online">ONL</span>
              <span class="chip-label">Online Miners</span>
              <span class="chip-value">${this._getEntityState(this._config?.online_miners_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-efficiency">
              <span class="chip-prefix chip-efficiency">EFF</span>
              <span class="chip-label">Energy Efficiency</span>
              <span class="chip-value"
                >${this._getEntityState(this._config?.fleet_energy_efficiency_entity)}</span
              >
            </div>

            <div class="sensor-chip stage-item hud-power">
              <span class="chip-prefix chip-power">PWR</span>
              <span class="chip-label">Power</span>
              <span class="chip-value">${this._getEntityState(this._config?.fleet_power_entity)}</span>
            </div>

            <div class="title-label stage-item hud-power-title">Fleet Power</div>

            <div class="sensor-chip stage-item hud-offline">
              <span class="chip-prefix chip-offline">OFF</span>
              <span class="chip-label">Miners Offline</span>
              <span class="chip-value">${this._getEntityState(this._config?.offline_miners_entity)}</span>
            </div>
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

      .positioning-overlay {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background-image:
          linear-gradient(to right, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.18) 1px, transparent 1px),
          linear-gradient(to right, transparent calc(50% - 1px), rgba(255, 184, 0, 0.8) 50%, transparent calc(50% + 1px)),
          linear-gradient(to bottom, transparent calc(50% - 1px), rgba(255, 184, 0, 0.8) 50%, transparent calc(50% + 1px));
        background-size: 10% 10%, 10% 10%, 100% 100%, 100% 100%;
        background-position: 0 0, 0 0, 0 0, 0 0;
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
        font-size: 0.75rem;
        line-height: 1;
        transform: translate(-50%, -50%);
      }

      .chip-prefix {
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 0.62rem;
        letter-spacing: 0.04em;
        font-weight: 700;
        color: #fff;
      }

      .chip-label {
        opacity: 0.9;
      }

      .chip-value {
        margin-left: 2px;
        font-weight: 700;
      }

      .title-label {
        position: absolute;
        color: #fff;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.03em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        transform: translate(-50%, -50%);
      }

      .chip-online {
        background: rgba(27, 146, 73, 0.9);
      }

      .chip-efficiency {
        background: rgba(57, 102, 195, 0.9);
      }

      .chip-power {
        background: rgba(181, 104, 12, 0.9);
      }

      .chip-offline {
        background: rgba(165, 39, 45, 0.9);
      }

      .hud-online {
        top: 20%;
        left: 24%;
      }

      .hud-efficiency {
        top: 31%;
        left: 58%;
      }

      .hud-power {
        top: 72%;
        left: 70%;
      }

      .hud-power-title {
        top: 60%;
        left: 75%;
      }

      .hud-offline {
        top: 73%;
        left: 34%;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "crypto-miner-card": CryptoMinerCard;
  }
}

console.info(`%c  CRYPTO-MINER-CARD  %c  v0.1.0  `, "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");

// Register the card with Home Assistant
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "crypto-miner-card",
  name: "Crypto Miner Card",
  description: "Custom card for monitoring crypto miner fleet",
  preview: true,
  documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/"
});

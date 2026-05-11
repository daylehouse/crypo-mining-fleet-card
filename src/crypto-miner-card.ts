import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseImage from "./baselayer.png";
import alienRegular from "./Alien-Encounters-Solid-Regular.ttf";
import alienBold from "./Alien-Encounters-Solid-Bold.ttf";
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
              <span class="chip-prefix chip-online">ONL</span>
              <span class="chip-label">Online Miners</span>
              <span class="chip-value">${this._getEntityState(this._config?.online_miners_entity)}</span>
            </div>

            <div class="sensor-chip stage-item hud-efficiency">
              <span class="chip-prefix chip-efficiency">EFF</span>
              <span class="chip-label">Energy Efficiency</span>
              <span class="chip-value"
                >${this._formatEfficiencyState(this._config?.fleet_energy_efficiency_entity)}</span
              >
            </div>

            <div class="sensor-chip stage-item hud-power">
              <span class="chip-prefix chip-power">PWR</span>
              <span class="chip-label">Power</span>
              <span class="chip-value">${this._formatPowerState(this._config?.fleet_power_entity)}</span>
            </div>

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
      @font-face {
        font-family: "AlienEncountersRegular";
        src: ${unsafeCSS(`url(${alienRegular})`)} format("truetype");
        font-style: normal;
        font-weight: 400;
      }

      @font-face {
        font-family: "AlienEncountersBold";
        src: ${unsafeCSS(`url(${alienBold})`)} format("truetype");
        font-style: normal;
        font-weight: 700;
      }

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
        font-size: 0.75rem;
        line-height: 1;
        transform: translate(-50%, -50%);
        border: none;
      }

      .chip-prefix {
        border-radius: 4px;
        padding: 2px 5px;
        font-size: 0.62rem;
        letter-spacing: 0.04em;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
        color: #fff;
        border: none;
      }

      .chip-label {
        opacity: 0.9;
        font-family: "AlienEncountersRegular", sans-serif;
      }

      .chip-value {
        margin-left: 2px;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
      }

      .chip-online {
        background: transparent;
        color: rgba(27, 146, 73, 1);
      }

      .chip-efficiency {
        background: transparent;
        color: rgba(57, 102, 195, 1);
      }

      .chip-power {
        background: transparent;
        color: rgba(181, 104, 12, 1);
      }

      .chip-offline {
        background: transparent;
        color: rgba(165, 39, 45, 1);
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

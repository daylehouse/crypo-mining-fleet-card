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
    return 8;
  }

  getGridOptions() {
    return {
      rows: 8,
      min_rows: 4,
      columns: 12
    };
  }

  static getStubConfig(): Omit<CryptoMinerCardConfig, "type"> {
    return {
      online_miners_entity: "sensor.online_miners"
    };
  }

  static getConfigForm() {
    return {
      schema: [
        {
          name: "online_miners_entity",
          required: true,
          selector: { entity: {} }
        }
      ],
      computeLabel: (schema: { name: string }) => {
        if (schema.name === "online_miners_entity") {
          return "Online Miners Entity";
        }
        return undefined;
      },
      computeHelper: (schema: { name: string }) => {
        if (schema.name === "online_miners_entity") {
          return "Select the entity to display as Online Miners";
        }
        return undefined;
      }
    };
  }

  private _getOnlineMinersValue(): string {
    const entityId = this._config?.online_miners_entity;
    if (!entityId) {
      return "Select entity in card editor";
    }

    const state = this.hass?.states?.[entityId]?.state;
    if (state === undefined || state === null) {
      return "Entity unavailable";
    }

    return state;
  }

  protected render() {
    return html`
      <ha-card>
        <div class="card-shell">
          <img class="card-image" src=${baseImage} alt="Crypto miner card image" />
          <div class="overlay">
            <div class="overlay-label">Online Miners</div>
            <div class="overlay-value">${this._getOnlineMinersValue()}</div>
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
      }

      .card-image {
        display: block;
        width: 100%;
        height: auto;
      }

      .overlay {
        position: absolute;
        top: 12px;
        left: 12px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        border-radius: 8px;
        padding: 8px 10px;
        line-height: 1.2;
      }

      .overlay-label {
        font-size: 0.7rem;
        opacity: 0.85;
      }

      .overlay-value {
        font-size: 1rem;
        font-weight: 700;
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

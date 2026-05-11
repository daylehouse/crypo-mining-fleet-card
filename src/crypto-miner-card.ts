import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import baseImage from "./base.jpg";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";

@customElement("crypto-miner-card")
export class CryptoMinerCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistantLike;
  @state() private _config?: CryptoMinerCardConfig;

  setConfig(config: CryptoMinerCardConfig) {
    if (!config) {
      throw new Error("Invalid configuration");
    }

    if (!config.online_miners_entity && !config.offline_miners_entity) {
      throw new Error("You need to define at least one miner sensor entity");
    }

    this._config = {
      type: "custom:crypto-miner-card",
      ...config
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
          selector: { entity: { domain: "sensor" } }
        },
        {
          name: "offline_miners_entity",
          selector: { entity: { domain: "sensor" } }
        }
      ]
    };
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions() {
    return {
      rows: 3,
      min_rows: 2,
      columns: 6
    };
  }

  static getStubConfig(): Omit<CryptoMinerCardConfig, "type"> {
    return {
      title: "Crypto Mining Fleet",
      online_miners_entity: "sensor.online_miners",
      offline_miners_entity: "sensor.offline_miners"
    };
  }

  protected render() {
    if (!this._config) {
      return html`<p>Configuration error</p>`;
    }

    const onlineMinersState = this._config.online_miners_entity
      ? this.hass?.states[this._config.online_miners_entity]?.state
      : "N/A";

    const offlineMinersState = this._config.offline_miners_entity
      ? this.hass?.states[this._config.offline_miners_entity]?.state
      : "N/A";

    return html`
      <ha-card>
        <div class="card-header">
          <h1 class="card-title">${this._config.title || "Crypto Mining Fleet"}</h1>
        </div>
        <div class="card-content" style=${`background-image: linear-gradient(rgba(9, 18, 29, 0.72), rgba(9, 18, 29, 0.72)), url('${baseImage}');`}>
          <div class="miner-stats">
            <div class="stat-box online">
              <div class="stat-label">Online Miners</div>
              <div class="stat-value">${onlineMinersState}</div>
            </div>
            <div class="stat-box offline">
              <div class="stat-label">Offline Miners</div>
              <div class="stat-value">${offlineMinersState}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      :host {
        --primary-color: #3498db;
        --offline-color: #e74c3c;
        --online-color: #2ecc71;
      }

      ha-card {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
      }

      .card-title {
        margin: 0;
        font-size: 1.5em;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .card-content {
        padding: 16px;
        background-size: cover;
        background-position: center;
        border-radius: 0 0 12px 12px;
      }

      .miner-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .stat-box {
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        color: white;
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        backdrop-filter: blur(2px);
      }

      .stat-box.online {
        background: linear-gradient(135deg, var(--online-color) 0%, #27ae60 100%);
      }

      .stat-box.offline {
        background: linear-gradient(135deg, var(--offline-color) 0%, #c0392b 100%);
      }

      .stat-label {
        font-size: 0.9em;
        opacity: 0.9;
        margin-bottom: 8px;
        font-weight: 500;
      }

      .stat-value {
        font-size: 2.5em;
        font-weight: bold;
      }

      @media (max-width: 600px) {
        .miner-stats {
          grid-template-columns: 1fr;
        }

        .stat-value {
          font-size: 2em;
        }
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

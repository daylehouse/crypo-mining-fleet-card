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
    return 4;
  }

  getGridOptions() {
    return {
      rows: 4,
      min_rows: 2,
      columns: 12
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
    if (!this._config || !this.hass) {
      return html`<p>Configuration error</p>`;
    }

    return html`
      <ha-card>
        <div class="card-content" style=${`background-image: url('${baseImage}');`}>
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
        height: 100%;
      }

      .card-content {
        padding: 24px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        min-height: 400px;
        position: relative;
        aspect-ratio: 16 / 9;
      }

      .stage {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .card-header {
        margin-bottom: 32px;
      }

      .card-title {
        margin: 0;
        font-size: 2em;
        font-weight: 600;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

      /* Helper class for coordinate-based sensor placement */
      .sensor-positioned {
        position: absolute;
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

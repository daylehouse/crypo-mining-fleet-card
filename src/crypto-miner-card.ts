import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseImage from "./base.jpg";
import { CryptoMinerCardConfig } from "./types";

@customElement("crypto-miner-card")
export class CryptoMinerCard extends LitElement {
  @property({ attribute: false }) public hass: unknown;
  private _config?: CryptoMinerCardConfig;

  setConfig(config: CryptoMinerCardConfig) {
    if (!config) {
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
    return {};
  }

  protected render() {
    return html`
      <ha-card>
        <div class="card-content" style=${`background-image: url('${baseImage}');`}></div>
      </ha-card>
    `;
  }

  static get styles() {
    return css`
      ha-card {
        overflow: hidden;
      }

      .card-content {
        width: 100%;
        height: 100%;
        min-height: 500px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
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

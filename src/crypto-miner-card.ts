import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import baseImage from "./baseimage.webp";
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
    return 12;
  }

  getGridOptions() {
    return {
      rows: 12,
      min_rows: 6,
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
      :host {
        margin: 0;
        padding: 0;
        display: block;
      }

      ha-card {
        overflow: hidden;
        margin: 0;
      }

      .card-content {
        width: 100%;
        aspect-ratio: 3 / 4;
        background-size: cover;
        background-position: -25% top;
        background-repeat: no-repeat;
        background-color: #000;
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

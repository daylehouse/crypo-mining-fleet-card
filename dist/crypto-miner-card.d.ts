import { LitElement } from "lit";
import { CryptoMinerCardConfig } from "./types";
export declare class CryptoMinerCard extends LitElement {
    hass: unknown;
    private _config?;
    setConfig(config: CryptoMinerCardConfig): void;
    getCardSize(): number;
    getGridOptions(): {
        rows: number;
        min_rows: number;
        columns: number;
    };
    static getStubConfig(): Omit<CryptoMinerCardConfig, "type">;
    protected render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "crypto-miner-card": CryptoMinerCard;
    }
}

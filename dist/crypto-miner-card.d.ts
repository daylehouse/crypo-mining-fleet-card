import { LitElement } from "lit";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";
export declare class CryptoMinerCard extends LitElement {
    hass: HomeAssistantLike;
    private _config?;
    setConfig(config: CryptoMinerCardConfig): void;
    static getConfigForm(): {
        schema: ({
            name: string;
            selector: {
                text: {};
                entity?: undefined;
            };
        } | {
            name: string;
            selector: {
                entity: {
                    domain: string;
                };
                text?: undefined;
            };
        })[];
    };
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

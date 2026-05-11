import { LitElement } from "lit";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";
export declare class CryptoMinerCard extends LitElement {
    hass?: HomeAssistantLike;
    private _config?;
    setConfig(config: CryptoMinerCardConfig): void;
    getCardSize(): number;
    getGridOptions(): {
        rows: number;
        min_rows: number;
        columns: number;
    };
    static getStubConfig(): Omit<CryptoMinerCardConfig, "type">;
    static getConfigForm(): {
        schema: {
            name: string;
            selector: {
                entity: {};
            };
        }[];
        computeLabel: (schema: {
            name: string;
        }) => "Online Miners Entity" | "Energy Efficiency Entity" | "Power Entity" | "Miners Offline Entity" | undefined;
        computeHelper: (schema: {
            name: string;
        }) => "Select the entity to display as Online Miners" | "Select the entity to display as Energy Efficiency" | "Select the entity to display as Power" | "Select the entity to display as Miners Offline" | undefined;
    };
    private _getEntityState;
    protected render(): import("lit").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        "crypto-miner-card": CryptoMinerCard;
    }
}

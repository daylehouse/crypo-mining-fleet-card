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
        schema: ({
            name: string;
            selector: {
                text: {};
                entity?: undefined;
            };
        } | {
            name: string;
            selector: {
                entity: {};
                text?: undefined;
            };
        })[];
        computeLabel: (schema: {
            name: string;
        }) => "Card Title" | "Online Miners Entity" | "Energy Efficiency Entity" | "Power Entity" | "Miners Offline Entity" | undefined;
        computeHelper: (schema: {
            name: string;
        }) => "Optional title displayed at the top of the card" | "Select the entity to display as Online Miners" | "Select the entity to display as Energy Efficiency" | "Select the entity to display as Power" | "Select the entity to display as Miners Offline" | undefined;
    };
    private _getEntityState;
    private _getEntityStateWithUnit;
    private _formatPowerState;
    private _formatEfficiencyState;
    protected render(): import("lit-html").TemplateResult<1>;
    static get styles(): import("lit").CSSResult;
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

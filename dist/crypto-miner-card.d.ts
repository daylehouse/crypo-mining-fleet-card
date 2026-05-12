import { LitElement } from "lit";
import type { PropertyValues } from "lit";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";
export declare class CryptoMinerCard extends LitElement {
    hass?: HomeAssistantLike;
    private _config?;
    private chart;
    private chartData;
    private chartUpdateInterval;
    private lastHistoryFetch;
    private efficiencyChart;
    private efficiencyChartData;
    private efficiencyChartUpdateInterval;
    private lastEfficiencyHistoryFetch;
    setConfig(config: CryptoMinerCardConfig): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected updated(): void;
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
                select?: undefined;
            };
        } | {
            name: string;
            selector: {
                entity: {};
                text?: undefined;
                select?: undefined;
            };
        } | {
            name: string;
            selector: {
                select: {
                    mode: string;
                    options: {
                        value: number;
                        label: string;
                    }[];
                };
                text?: undefined;
                entity?: undefined;
            };
        })[];
        computeLabel: (schema: {
            name: string;
        }) => "Card Title" | "Online Miners Entity" | "Energy Efficiency Entity" | "Power Entity" | "Miners Offline Entity" | "BTC Rate Entity" | "BCH Rate Entity" | "LTC Rate Entity" | "ALEO Rate Entity" | "Solo Pool Hashrate Entity" | "Fleet Hashrate Chart Entity" | "Efficiency Chart Entity" | "Hashrate Chart Time Span" | "Efficiency Chart Time Span" | undefined;
        computeHelper: (schema: {
            name: string;
        }) => "Optional title displayed at the top of the card" | "Select the entity to display as Online Miners" | "Select the entity to display as Energy Efficiency" | "Select the entity to display as Power" | "Select the entity to display as Miners Offline" | "Select the entity to display as BTC Rate" | "Select the entity to display as BCH Rate" | "Select the entity to display as LTC Rate" | "Select the entity to display as ALEO Rate" | "Select the entity to display as Solo Pool Hashrate" | "Entity used to render fleet hashrate history chart" | "Entity used to render efficiency history chart" | "History span shown in the hashrate chart" | "History span shown in the efficiency chart" | undefined;
    };
    private startChartUpdater;
    private startEfficiencyChartUpdater;
    private getChartSpanMinutes;
    private getEfficiencyChartSpanMinutes;
    private fetchAndPopulateHashrateHistory;
    private extractHistoryPoints;
    private fetchAndPopulateEfficiencyHistory;
    private renderHashrateChart;
    private renderEfficiencyChart;
    private _getEntityState;
    private _getEntityStateWithUnit;
    private _formatPowerState;
    private _formatEfficiencyState;
    private _formatHashrateState;
    private _getEntityFriendlyName;
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

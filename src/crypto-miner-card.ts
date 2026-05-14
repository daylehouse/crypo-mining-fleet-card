import { LitElement, html, css } from "lit";
import type { PropertyValues } from "lit";
import type { ChartConfiguration } from "chart.js";
import Chart from "chart.js/auto";
import { customElement, property } from "lit/decorators.js";
import baseImage from "./baselayer.png";
import alienRegular from "./Alien-Encounters-Solid-Regular.ttf";
import alienBold from "./Alien-Encounters-Solid-Bold.ttf";
import { CryptoMinerCardConfig, HomeAssistantLike } from "./types";

const chartUpdateIntervalMs = 60000;
const chartHistoryThrottleMs = 60000;

interface HistoryPoint {
  s?: string;
  lu?: number;
  last_updated_ts?: number;
  state?: string;
}

// Inject @font-face into document head so fonts work across Shadow DOM boundaries
if (!document.getElementById("crypto-miner-card-fonts")) {
  const style = document.createElement("style");
  style.id = "crypto-miner-card-fonts";
  style.textContent = `
    @font-face {
      font-family: "AlienEncountersRegular";
      src: url("${alienRegular}") format("truetype");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "AlienEncountersBold";
      src: url("${alienBold}") format("truetype");
      font-weight: 700;
      font-style: normal;
    }
  `;
  document.head.appendChild(style);
}

@customElement("crypto-miner-card")
export class CryptoMinerCard extends LitElement {
  private chartMarqueeIndex = 0;
  private chartMarqueeInterval: number | null = null;

  private startChartMarquee() {
    if (this.chartMarqueeInterval !== null) return;
    this.chartMarqueeInterval = window.setInterval(() => {
      this.chartMarqueeIndex = (this.chartMarqueeIndex + 1) % 2;
      this.requestUpdate();
    }, 10000);
  }

  private stopChartMarquee() {
    if (this.chartMarqueeInterval !== null) {
      clearInterval(this.chartMarqueeInterval);
      this.chartMarqueeInterval = null;
    }
  }
  @property({ attribute: false }) public hass?: HomeAssistantLike;
  private _config?: CryptoMinerCardConfig;
  private chart: Chart | null = null;
  private chartData: { labels: string[]; hashrate: number[] } = {
    labels: [],
    hashrate: []
  };
  private chartUpdateInterval: number | null = null;
  private lastHistoryFetch = 0;
  private efficiencyChart: Chart | null = null;
  private efficiencyChartData: { labels: string[]; efficiency: number[] } = {
    labels: [],
    efficiency: []
  };
  private efficiencyChartUpdateInterval: number | null = null;
  private lastEfficiencyHistoryFetch = 0;
  private powerChart: Chart | null = null;
  private powerChartData: { labels: string[]; power: number[] } = {
    labels: [],
    power: []
  };
  private powerChartUpdateInterval: number | null = null;
  private lastPowerHistoryFetch = 0;

  setConfig(config: CryptoMinerCardConfig) {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      throw new Error("Invalid configuration");
    }

    this._config = config;
    void this.fetchAndPopulateHashrateHistory(true);
  }

  connectedCallback(): void {
    super.connectedCallback();
    void this.fetchAndPopulateHashrateHistory(true);
    void this.fetchAndPopulateEfficiencyHistory(true);
    void this.fetchAndPopulatePowerHistory(true);
    this.startChartUpdater();
    this.startEfficiencyChartUpdater();
    this.startPowerChartUpdater();
    this.startChartMarquee();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.chartUpdateInterval !== null) {
      clearInterval(this.chartUpdateInterval);
      this.chartUpdateInterval = null;
    }

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    if (this.efficiencyChartUpdateInterval !== null) {
      clearInterval(this.efficiencyChartUpdateInterval);
      this.efficiencyChartUpdateInterval = null;
    }

    if (this.efficiencyChart) {
      this.efficiencyChart.destroy();
      this.efficiencyChart = null;
    }

    if (this.powerChartUpdateInterval !== null) {
      clearInterval(this.powerChartUpdateInterval);
      this.powerChartUpdateInterval = null;
    }

    if (this.powerChart) {
      this.powerChart.destroy();
      this.powerChart = null;
    }

    this.stopChartMarquee();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("hass")) {
      void this.fetchAndPopulateHashrateHistory(true);
      void this.fetchAndPopulateEfficiencyHistory(true);
      void this.fetchAndPopulatePowerHistory(true);
    }
  }

  protected updated(): void {
    this.renderHashrateChart();
    this.renderEfficiencyChart();
    this.renderPowerChart();
  }

  getCardSize(): number {
    return 5;
  }

  getGridOptions() {
    return {
      rows: 5,
      min_rows: 3,
      columns: 12
    };
  }

  static getStubConfig(): Omit<CryptoMinerCardConfig, "type"> {
    return {
      online_miners_entity: "sensor.online_miners",
      offline_miners_entity: "sensor.miners_offline",
      fleet_power_entity: "sensor.fleet_power",
      fleet_energy_efficiency_entity: "sensor.fleet_energy_efficiency",
      btc_rate_entity: "sensor.btc_rate",
      bch_rate_entity: "sensor.bch_rate",
      ltc_rate_entity: "sensor.ltc_rate",
      aleo_rate_entity: "sensor.aleo_rate",
      solo_pool_hashrate_entity: "sensor.solo_pool_hashrate",
      fleet_hashrate_chart_entity: "sensor.fleet_hashrate",
      efficiency_chart_entity: "sensor.fleet_energy_efficiency",
      chart_span_minutes: 60,
      efficiency_chart_span_minutes: 60,
      power_chart_span_minutes: 60
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
          selector: { entity: {} }
        },
        {
          name: "fleet_energy_efficiency_entity",
          selector: { entity: {} }
        },
        {
          name: "fleet_power_entity",
          selector: { entity: {} }
        },
        {
          name: "offline_miners_entity",
          selector: { entity: {} }
        },
        {
          name: "btc_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "bch_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "ltc_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "aleo_rate_entity",
          selector: { entity: {} }
        },
        {
          name: "solo_pool_hashrate_entity",
          selector: { entity: {} }
        },
        {
          name: "fleet_hashrate_chart_entity",
          selector: { entity: {} }
        },
        {
          name: "efficiency_chart_entity",
          selector: { entity: {} }
        },
        {
          name: "chart_span_minutes",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: 5, label: "5 minutes" },
                { value: 15, label: "15 minutes" },
                { value: 30, label: "30 minutes" },
                { value: 60, label: "60 minutes" }
              ]
            }
          }
        },
        {
          name: "efficiency_chart_span_minutes",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: 5, label: "5 minutes" },
                { value: 15, label: "15 minutes" },
                { value: 30, label: "30 minutes" },
                { value: 60, label: "60 minutes" }
              ]
            }
          }
        },
        {
          name: "power_chart_span_minutes",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                { value: 5, label: "5 minutes" },
                { value: 15, label: "15 minutes" },
                { value: 30, label: "30 minutes" },
                { value: 60, label: "60 minutes" }
              ]
            }
          }
        }
      ],
      computeLabel: (schema: { name: string }) => {
        if (schema.name === "title") {
          return "Card Title";
        }
        if (schema.name === "online_miners_entity") {
          return "Online Miners Entity";
        }
        if (schema.name === "fleet_energy_efficiency_entity") {
          return "Energy Efficiency Entity";
        }
        if (schema.name === "fleet_power_entity") {
          return "Power Entity";
        }
        if (schema.name === "offline_miners_entity") {
          return "Miners Offline Entity";
        }
        if (schema.name === "btc_rate_entity") {
          return "BTC Rate Entity";
        }
        if (schema.name === "bch_rate_entity") {
          return "BCH Rate Entity";
        }
        if (schema.name === "ltc_rate_entity") {
          return "LTC Rate Entity";
        }
        if (schema.name === "aleo_rate_entity") {
          return "ALEO Rate Entity";
        }
        if (schema.name === "solo_pool_hashrate_entity") {
          return "Solo Pool Hashrate Entity";
        }
        if (schema.name === "fleet_hashrate_chart_entity") {
          return "Fleet Hashrate Chart Entity";
        }
        if (schema.name === "efficiency_chart_entity") {
          return "Efficiency Chart Entity";
        }
        if (schema.name === "chart_span_minutes") {
          return "Hashrate Chart Time Span";
        }
        if (schema.name === "efficiency_chart_span_minutes") {
          return "Efficiency Chart Time Span";
        }
        if (schema.name === "power_chart_span_minutes") {
          return "Power Chart Time Span";
        }
        return undefined;
      },
      computeHelper: (schema: { name: string }) => {
        if (schema.name === "title") {
          return "Optional title displayed at the top of the card";
        }
        if (schema.name === "online_miners_entity") {
          return "Select the entity to display as Online Miners";
        }
        if (schema.name === "fleet_energy_efficiency_entity") {
          return "Select the entity to display as Energy Efficiency";
        }
        if (schema.name === "fleet_power_entity") {
          return "Select the entity to display as Power";
        }
        if (schema.name === "offline_miners_entity") {
          return "Select the entity to display as Miners Offline";
        }
        if (schema.name === "btc_rate_entity") {
          return "Select the entity to display as BTC Rate";
        }
        if (schema.name === "bch_rate_entity") {
          return "Select the entity to display as BCH Rate";
        }
        if (schema.name === "ltc_rate_entity") {
          return "Select the entity to display as LTC Rate";
        }
        if (schema.name === "aleo_rate_entity") {
          return "Select the entity to display as ALEO Rate";
        }
        if (schema.name === "solo_pool_hashrate_entity") {
          return "Select the entity to display as Solo Pool Hashrate";
        }
        if (schema.name === "fleet_hashrate_chart_entity") {
          return "Entity used to render fleet hashrate history chart";
        }
        if (schema.name === "efficiency_chart_entity") {
          return "Entity used to render efficiency history chart";
        }
        if (schema.name === "chart_span_minutes") {
          return "History span shown in the hashrate chart";
        }
        if (schema.name === "efficiency_chart_span_minutes") {
          return "History span shown in the efficiency chart";
        }
        if (schema.name === "power_chart_span_minutes") {
          return "History span shown in the power chart";
        }
        return undefined;
      }
    };
  }

  private startChartUpdater(): void {
    if (this.chartUpdateInterval !== null) {
      return;
    }

    this.chartUpdateInterval = window.setInterval(() => {
      void this.fetchAndPopulateHashrateHistory();
    }, chartUpdateIntervalMs);
  }

  private startEfficiencyChartUpdater(): void {
    if (this.efficiencyChartUpdateInterval !== null) {
      return;
    }

    this.efficiencyChartUpdateInterval = window.setInterval(() => {
      void this.fetchAndPopulateEfficiencyHistory();
    }, chartUpdateIntervalMs);
  }

  private startPowerChartUpdater(): void {
    if (this.powerChartUpdateInterval !== null) {
      return;
    }

    this.powerChartUpdateInterval = window.setInterval(() => {
      void this.fetchAndPopulatePowerHistory();
    }, chartUpdateIntervalMs);
  }

  private getChartSpanMinutes(): number {
    const configuredSpan = Number(this._config?.chart_span_minutes);
    if ([5, 15, 30, 60].includes(configuredSpan)) {
      return configuredSpan;
    }

    return 60;
  }

  private getEfficiencyChartSpanMinutes(): number {
    const configuredSpan = Number(this._config?.efficiency_chart_span_minutes);
    if ([5, 15, 30, 60].includes(configuredSpan)) {
      return configuredSpan;
    }

    return 60;
  }

  private getPowerChartSpanMinutes(): number {
    const configuredSpan = Number(this._config?.power_chart_span_minutes);
    if ([5, 15, 30, 60].includes(configuredSpan)) {
      return configuredSpan;
    }

    return 60;
  }

  private async fetchAndPopulateHashrateHistory(force = false): Promise<void> {
    const hashrateEntity = this._config?.fleet_hashrate_chart_entity;
    if (!this.hass || !hashrateEntity || !this.hass.connection) {
      return;
    }

    const nowTs = Date.now();
    if (!force && nowTs - this.lastHistoryFetch < chartHistoryThrottleMs) {
      return;
    }
    this.lastHistoryFetch = nowTs;

    const end = new Date();
    const spanMinutes = this.getChartSpanMinutes();
    const start = new Date(end.getTime() - spanMinutes * 60 * 1000);

    try {
      const historyResult = await this.hass.connection.sendMessagePromise<unknown>({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [hashrateEntity],
        minimal_response: true,
        no_attributes: true
      });

      const historyPoints = this.extractHistoryPoints(historyResult, hashrateEntity);
      this.chartData = { labels: [], hashrate: [] };

      for (let i = 0; i < historyPoints.length; i += 1) {
        const point = historyPoints[i];
        const rawTimestamp = point.lu ?? point.last_updated_ts;
        const timestampMs = typeof rawTimestamp === "number" ? rawTimestamp * 1000 : NaN;
        const ts = new Date(timestampMs);
        const label = Number.isFinite(ts.getTime())
          ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : `${i}`;

        const hashValue = parseFloat(point.s ?? point.state ?? "NaN");
        if (!Number.isNaN(hashValue)) {
          this.chartData.labels.push(label);
          this.chartData.hashrate.push(hashValue);
        }
      }

      if (this.chartData.labels.length === 0) {
        const hashrateState = this._getEntityState(hashrateEntity);
        const hashrateValue = parseFloat(hashrateState);
        if (!Number.isNaN(hashrateValue)) {
          this.chartData.labels.push("Now");
          this.chartData.hashrate.push(hashrateValue);
        }
      }

      this.renderHashrateChart();
    } catch (error) {
      console.error("Failed to fetch hashrate history for crypto-miner-card", error);
    }
  }

  private extractHistoryPoints(historyResult: unknown, entityId: string): HistoryPoint[] {
    if (historyResult && typeof historyResult === "object" && !Array.isArray(historyResult)) {
      const resultMap = historyResult as Record<string, HistoryPoint[]>;
      return resultMap[entityId] ?? [];
    }

    if (Array.isArray(historyResult)) {
      const entities = historyResult as Array<Array<HistoryPoint & { entity_id?: string }>>;
      return entities.find((series) => series[0]?.entity_id === entityId) ?? [];
    }

    return [];
  }

  private async fetchAndPopulateEfficiencyHistory(force = false): Promise<void> {
    const efficiencyEntity = this._config?.efficiency_chart_entity;
    if (!this.hass || !efficiencyEntity || !this.hass.connection) {
      return;
    }

    const nowTs = Date.now();
    if (!force && nowTs - this.lastEfficiencyHistoryFetch < chartHistoryThrottleMs) {
      return;
    }
    this.lastEfficiencyHistoryFetch = nowTs;

    const end = new Date();
    const spanMinutes = this.getEfficiencyChartSpanMinutes();
    const start = new Date(end.getTime() - spanMinutes * 60 * 1000);

    try {
      const historyResult = await this.hass.connection.sendMessagePromise<unknown>({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [efficiencyEntity],
        minimal_response: true,
        no_attributes: true
      });

      const historyPoints = this.extractHistoryPoints(historyResult, efficiencyEntity);
      this.efficiencyChartData = { labels: [], efficiency: [] };

      for (let i = 0; i < historyPoints.length; i += 1) {
        const point = historyPoints[i];
        const rawTimestamp = point.lu ?? point.last_updated_ts;
        const timestampMs = typeof rawTimestamp === "number" ? rawTimestamp * 1000 : NaN;
        const ts = new Date(timestampMs);
        const label = Number.isFinite(ts.getTime())
          ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : `${i}`;

        const efficiencyValue = parseFloat(point.s ?? point.state ?? "NaN");
        if (!Number.isNaN(efficiencyValue)) {
          this.efficiencyChartData.labels.push(label);
          this.efficiencyChartData.efficiency.push(efficiencyValue);
        }
      }

      if (this.efficiencyChartData.labels.length === 0) {
        const efficiencyState = this._getEntityState(efficiencyEntity);
        const efficiencyValue = parseFloat(efficiencyState);
        if (!Number.isNaN(efficiencyValue)) {
          this.efficiencyChartData.labels.push("Now");
          this.efficiencyChartData.efficiency.push(efficiencyValue);
        }
      }

      this.renderEfficiencyChart();
    } catch (error) {
      console.error("Failed to fetch efficiency history for crypto-miner-card", error);
    }
  }

  private async fetchAndPopulatePowerHistory(force = false): Promise<void> {
    const powerEntity = this._config?.fleet_power_entity;
    if (!this.hass || !powerEntity || !this.hass.connection) {
      return;
    }

    const nowTs = Date.now();
    if (!force && nowTs - this.lastPowerHistoryFetch < chartHistoryThrottleMs) {
      return;
    }
    this.lastPowerHistoryFetch = nowTs;

    const end = new Date();
    const spanMinutes = this.getPowerChartSpanMinutes();
    const start = new Date(end.getTime() - spanMinutes * 60 * 1000);

    try {
      const historyResult = await this.hass.connection.sendMessagePromise<unknown>({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [powerEntity],
        minimal_response: true,
        no_attributes: true
      });

      const historyPoints = this.extractHistoryPoints(historyResult, powerEntity);
      this.powerChartData = { labels: [], power: [] };

      for (let i = 0; i < historyPoints.length; i += 1) {
        const point = historyPoints[i];
        const rawTimestamp = point.lu ?? point.last_updated_ts;
        const timestampMs = typeof rawTimestamp === "number" ? rawTimestamp * 1000 : NaN;
        const ts = new Date(timestampMs);
        const label = Number.isFinite(ts.getTime())
          ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : `${i}`;

        const powerValue = parseFloat(point.s ?? point.state ?? "NaN");
        if (!Number.isNaN(powerValue)) {
          this.powerChartData.labels.push(label);
          this.powerChartData.power.push(powerValue);
        }
      }

      if (this.powerChartData.labels.length === 0) {
        const powerState = this._getEntityState(powerEntity);
        const powerValue = parseFloat(powerState);
        if (!Number.isNaN(powerValue)) {
          this.powerChartData.labels.push("Now");
          this.powerChartData.power.push(powerValue);
        }
      }

      this.renderPowerChart();
    } catch (error) {
      console.error("Failed to fetch power history for crypto-miner-card", error);
    }
  }

  private renderHashrateChart(): void {
    const hashrateEntity = this._config?.fleet_hashrate_chart_entity;
    if (!hashrateEntity) {
      return;
    }

    const chartTitle = this._getEntityFriendlyName(hashrateEntity);
    const isMobileChart = window.matchMedia("(max-width: 640px)").matches;

    const canvas = this.renderRoot?.querySelector("#fleet-hashrate-chart") as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const chartConfig: ChartConfiguration<"line", number[], string> = {
      type: "line",
      data: {
        labels: this.chartData.labels,
        datasets: [
          {
            label: "Fleet Hashrate",
            data: this.chartData.hashrate,
            borderColor: "#15ff00",
            backgroundColor: "rgba(21,255,0,0.15)",
            tension: 0.28,
            pointRadius: 0,
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            color: "#ffffff",
            font: {
              size: 12,
              family: "AlienEncountersBold"
            },
            padding: {
              top: isMobileChart ? 1 : 2,
              bottom: isMobileChart ? 1 : 2
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#9ffbff",
              font: { size: 10, family: "AlienEncountersRegular" },
              maxTicksLimit: 4
            },
            grid: { color: "rgba(159,251,255,0.12)" }
          },
          y: {
            title: {
              display: true,
              text: "TH/s",
              color: "#ffffff",
              font: { size: 10, family: "AlienEncountersRegular" }
            },
            ticks: {
              color: "#15ff00",
              font: { size: 10, family: "AlienEncountersRegular" },
              maxTicksLimit: 3,
              stepSize: 2,
              callback: (tickValue) => Math.round(Number(tickValue)).toString()
            },
            grid: { color: "rgba(21,255,0,0.12)" }
          }
        }
      }
    };

    if (!this.chart) {
      this.chart = new Chart(context, chartConfig);
      return;
    }

    this.chart.data.labels = this.chartData.labels;
    this.chart.data.datasets[0].data = this.chartData.hashrate;
    if (this.chart.options.plugins?.title) {
      this.chart.options.plugins.title.text = chartTitle;
    }
    this.chart.update("none");
  }

  private renderEfficiencyChart(): void {
    const efficiencyEntity = this._config?.efficiency_chart_entity;
    if (!efficiencyEntity) {
      return;
    }

    const chartTitle = this._getEntityFriendlyName(efficiencyEntity);
    const isMobileChart = window.matchMedia("(max-width: 640px)").matches;

    const canvas = this.renderRoot?.querySelector("#efficiency-chart") as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const chartConfig: ChartConfiguration<"line", number[], string> = {
      type: "line",
      data: {
        labels: this.efficiencyChartData.labels,
        datasets: [
          {
            label: "Efficiency",
            data: this.efficiencyChartData.efficiency,
            borderColor: "#00f5ff",
            backgroundColor: "rgba(0,245,255,0.12)",
            tension: 0.28,
            pointRadius: 0,
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: {
          padding: {
            left: isMobileChart ? 2 : 4,
            right: isMobileChart ? 2 : 4,
            top: isMobileChart ? 0 : 2,
            bottom: isMobileChart ? 0 : 2
          }
        },
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            color: "#ffffff",
            font: {
              size: 12,
              family: "AlienEncountersBold"
            },
            padding: {
              top: isMobileChart ? 1 : 2,
              bottom: isMobileChart ? 1 : 2
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#ffffff",
              font: { size: 9, family: "AlienEncountersRegular" },
              maxTicksLimit: 3
            },
            grid: { color: "rgba(159,251,255,0.12)" }
          },
          y: {
            title: {
              display: true,
              text: "J/TH",
              color: "#ffffff",
              font: { size: 9, family: "AlienEncountersRegular" }
            },
            ticks: {
              color: "#ffffff",
              font: { size: 9, family: "AlienEncountersRegular" },
              maxTicksLimit: 3,
              stepSize: 1,
              callback: (tickValue) => Math.round(Number(tickValue)).toString()
            },
            grid: { color: "rgba(0,245,255,0.12)" }
          }
        }
      }
    };

    if (!this.efficiencyChart) {
      this.efficiencyChart = new Chart(context, chartConfig);
      return;
    }

    this.efficiencyChart.data.labels = this.efficiencyChartData.labels;
    this.efficiencyChart.data.datasets[0].data = this.efficiencyChartData.efficiency;
    if (this.efficiencyChart.options.plugins?.title) {
      this.efficiencyChart.options.plugins.title.text = chartTitle;
    }
    this.efficiencyChart.update("none");
  }

  private renderPowerChart(): void {
    const powerEntity = this._config?.fleet_power_entity;
    if (!powerEntity) {
      return;
    }

    const chartTitle = this._getEntityFriendlyName(powerEntity, "Power");
    const isMobileChart = window.matchMedia("(max-width: 640px)").matches;

    const canvas = this.renderRoot?.querySelector("#power-chart") as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const chartConfig: ChartConfiguration<"line", number[], string> = {
      type: "line",
      data: {
        labels: this.powerChartData.labels,
        datasets: [
          {
            label: "Power",
            data: this.powerChartData.power,
            borderColor: "#ff2bd6",
            backgroundColor: "rgba(255,43,214,0.12)",
            tension: 0.28,
            pointRadius: 0,
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        layout: {
          padding: {
            left: isMobileChart ? 2 : 4,
            right: isMobileChart ? 2 : 4,
            top: isMobileChart ? 0 : 2,
            bottom: isMobileChart ? 0 : 2
          }
        },
        plugins: {
          title: {
            display: true,
            text: chartTitle,
            color: "#ffffff",
            font: {
              size: 12,
              family: "AlienEncountersBold"
            },
            padding: {
              top: isMobileChart ? 1 : 2,
              bottom: isMobileChart ? 1 : 2
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#ffffff",
              font: { size: 9, family: "AlienEncountersRegular" },
              maxTicksLimit: 3
            },
            grid: { color: "rgba(255,255,255,0.12)" }
          },
          y: {
            title: {
              display: true,
              text: "kW",
              color: "#ffffff",
              font: { size: 9, family: "AlienEncountersRegular" }
            },
            ticks: {
              color: "#ffffff",
              font: { size: 9, family: "AlienEncountersRegular" },
              maxTicksLimit: 3,
              callback: (tickValue) => Math.round(Number(tickValue)).toString()
            },
            grid: { color: "rgba(255,43,214,0.12)" }
          }
        }
      }
    };

    if (!this.powerChart) {
      this.powerChart = new Chart(context, chartConfig);
      return;
    }

    this.powerChart.data.labels = this.powerChartData.labels;
    this.powerChart.data.datasets[0].data = this.powerChartData.power;
    if (this.powerChart.options.plugins?.title) {
      this.powerChart.options.plugins.title.text = chartTitle;
    }
    this.powerChart.update("none");
  }

  private _getEntityState(entityId?: string): string {
    if (!entityId) {
      return "--";
    }

    const state = this.hass?.states?.[entityId]?.state;
    if (state === undefined || state === null) {
      return "n/a";
    }

    return state;
  }

  private _getEntityStateWithUnit(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    if (!entityId) {
      return state;
    }

    const unit = this.hass?.states?.[entityId]?.attributes?.unit_of_measurement;
    if (typeof unit === "string" && unit.trim().length > 0) {
      return `${state} ${unit}`;
    }

    return state;
  }

  private _formatPowerState(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    const numericState = Number(state);
    if (!Number.isFinite(numericState)) {
      return this._getEntityStateWithUnit(entityId);
    }

    if (numericState >= 1000) {
      const kiloWatts = numericState / 1000;
      return `${kiloWatts.toFixed(1)} kW`;
    }

    return `${Math.round(numericState)} W`;
  }

  private _formatEfficiencyState(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    const numericState = Number(state);
    if (!Number.isFinite(numericState)) {
      return this._getEntityStateWithUnit(entityId);
    }

    return `${numericState.toFixed(2)} J/TH`;
  }

  private _formatHashrateState(entityId?: string): string {
    const state = this._getEntityState(entityId);
    if (state === "--" || state === "n/a") {
      return state;
    }

    const numericState = Number(state);
    if (!Number.isFinite(numericState)) {
      return this._getEntityStateWithUnit(entityId);
    }

    const formattedValue = numericState.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (!entityId) {
      return formattedValue;
    }

    const unit = this.hass?.states?.[entityId]?.attributes?.unit_of_measurement;
    if (typeof unit === "string" && unit.trim().length > 0) {
      return `${formattedValue} ${unit}`;
    }

    return formattedValue;
  }

  private _getEntityFriendlyName(entityId?: string, fallback = "Fleet Hashrate"): string {
    if (!entityId) {
      return fallback;
    }

    const friendlyName = this.hass?.states?.[entityId]?.attributes?.friendly_name;
    if (typeof friendlyName === "string" && friendlyName.trim().length > 0) {
      const cleanedFriendlyName = friendlyName
        .trim()
        .replace(/^crypto\s+miner\s+fleet\s+monitor\s*/i, "")
        .replace(/^crypto\s+miner\s+feet\s+montor\s*/i, "")
        .replace(/^fleet\s+/i, "")
        .trim();

      if (cleanedFriendlyName.length > 0) {
        return cleanedFriendlyName;
      }
    }

    const entityName = entityId
      .split(".")
      .pop()
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
    if (entityName) {
      return entityName;
    }

    return fallback;
  }

  protected render() {
    const title = this._config?.title?.trim() || "";

    return html`
      <ha-card>
        <div class="card-shell">
          <img class="card-image" src=${baseImage} alt="Crypto miner card image" />
          <div class="stage-layer">
            <div class="card-title stage-item">${title}</div>
            ${this._config?.fleet_hashrate_chart_entity ? html`<div class="fleet-hashrate-chart-wrap stage-item"><canvas id="fleet-hashrate-chart" aria-label="Fleet hashrate history chart"></canvas></div>` : null}
            <div class="efficiency-power-marquee stage-item">
              ${this._config?.efficiency_chart_entity ? html`
                <div class="efficiency-chart-stack" style="opacity: ${this.chartMarqueeIndex === 0 ? 1 : 0}; transform: translateY(${this.chartMarqueeIndex === 0 ? '0%' : '-100%'}); pointer-events: ${this.chartMarqueeIndex === 0 ? 'auto' : 'none'};">
                  <canvas id="efficiency-chart" aria-label="Efficiency history chart"></canvas>
                </div>
              ` : null}
              ${this._config?.fleet_power_entity ? html`
                <div class="power-chart-stack" style="opacity: ${this.chartMarqueeIndex === 1 ? 1 : 0}; transform: translateY(${this.chartMarqueeIndex === 1 ? '0%' : '100%'}); pointer-events: ${this.chartMarqueeIndex === 1 ? 'auto' : 'none'};">
                  <canvas id="power-chart" aria-label="Power history chart"></canvas>
                </div>
              ` : null}
            </div>
            <div class="sensor-chip stage-item hud-online"><ha-icon class="chip-icon chip-icon-online" icon="mdi:account-hard-hat"></ha-icon><span class="chip-label">Online:</span><span class="chip-value">${this._getEntityState(this._config?.online_miners_entity)}</span></div>
            <div class="sensor-chip stage-item hud-efficiency"><ha-icon class="chip-icon chip-icon-efficiency" icon="mdi:leaf"></ha-icon><span class="chip-label">Efficiency</span><span class="chip-value">${this._formatEfficiencyState(this._config?.fleet_energy_efficiency_entity)}</span></div>
            <div class="sensor-chip stage-item hud-power"><ha-icon class="chip-icon chip-icon-power" icon="mdi:power"></ha-icon><span class="chip-label">Power</span><span class="chip-value">${this._formatPowerState(this._config?.fleet_power_entity)}</span></div>
            <div class="sensor-chip stage-item hud-offline"><ha-icon class="chip-icon chip-icon-offline" icon="mdi:account-hard-hat"></ha-icon><span class="chip-label">Offline:</span><span class="chip-value">${this._getEntityState(this._config?.offline_miners_entity)}</span></div>
            <div class="sensor-chip stage-item hud-btc-rate"><div class="chip-rate-head"><span class="chip-label">BTC Hashrate</span></div><span class="chip-value">${this._formatHashrateState(this._config?.btc_rate_entity)}</span></div>
            <div class="sensor-chip stage-item hud-bch-rate"><div class="chip-rate-head"><span class="chip-label">BCH Hashrate</span></div><span class="chip-value">${this._formatHashrateState(this._config?.bch_rate_entity)}</span></div>
            <div class="sensor-chip stage-item hud-ltc-rate"><div class="chip-rate-head"><span class="chip-label">LTC Hashrate</span></div><span class="chip-value">${this._getEntityStateWithUnit(this._config?.ltc_rate_entity)}</span></div>
            <div class="sensor-chip stage-item hud-aleo-rate"><div class="chip-rate-head"><span class="chip-label">ALEO Hashrate</span></div><span class="chip-value">${this._getEntityStateWithUnit(this._config?.aleo_rate_entity)}</span></div>
            <div class="sensor-chip stage-item hud-solo-pool-hashrate"><div class="chip-rate-head"><span class="chip-label">Solo Pool</span></div><span class="chip-value">${this._getEntityStateWithUnit(this._config?.solo_pool_hashrate_entity)}</span></div>
            <div class="miners-title stage-item">Miners</div>
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
        font-family: "AlienEncountersRegular", sans-serif;
      }

      ha-card {
        padding: 0;
        overflow: hidden;
      }

        .card-shell {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 17;
        }

      .card-image {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 35%;
        z-index: 0;
        pointer-events: none;
      }

      .stage-layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        pointer-events: none;
      }

      .stage-item {
        pointer-events: auto;
        z-index: 2;
      }

      .fleet-hashrate-chart-wrap {
        position: absolute;
        left: 8%;
        top: 12%;
        width: 40%;
        height: 14.5%;
        z-index: 1;
      }

      #fleet-hashrate-chart {
        width: 100%;
        height: 100%;
        display: block;
        background: transparent;
      }

      .efficiency-power-marquee {
        position: absolute;
        left: 52%;
        top: 12%;
        width: 40%;
        height: 14.5%;
        overflow: hidden;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
      }

      .efficiency-chart-stack,
      .power-chart-stack {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        transition: opacity 0.5s, transform 0.5s;
      }

      #efficiency-chart,
      #power-chart {
        width: 100%;
        height: 100%;
        display: block;
        background: transparent;
      }

      .card-title {
        position: absolute;
        top: 4%;
        left: 35%;
        width: 30%;
        height: 5%;
        border-radius: 999px;
        padding: 6px 12px;
        color: #fff;
        font-size: 0.8rem;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sensor-chip {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        background: transparent;
        color: #fff;
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 0.927rem;
        line-height: 1;
        border: none;
      }

      .chip-label {
        opacity: 0.9;
        font-family: "AlienEncountersRegular", sans-serif;
      }

      .chip-icon {
        font-size: 1.105rem;
        --mdc-icon-size: 1.105rem;
        line-height: 1;
      }

      .chip-icon-online {
        color: #39ff14;
      }

      .chip-icon-offline {
        color: #ff2bd6;
      }

      .chip-icon-efficiency {
        color: #00f5ff;
      }

      .chip-icon-power {
        color: #f8ff00;
      }

      .hud-btc-rate,
      .hud-bch-rate,
      .hud-ltc-rate,
      .hud-aleo-rate,
      .hud-solo-pool-hashrate {
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 20%;
        padding: 0;
        font-size: 0.751rem;
        line-height: 1.15;
        text-align: center;
      }

      .chip-rate-head {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
      }

      .hud-btc-rate .chip-value,
      .hud-bch-rate .chip-value,
      .hud-ltc-rate .chip-value,
      .hud-aleo-rate .chip-value,
      .hud-solo-pool-hashrate .chip-value {
        margin-left: 0;
        width: 100%;
        text-align: center;
      }

      .hud-btc-rate .chip-label {
        color: #ff8c00;
      }

      .hud-bch-rate .chip-label {
        color: #39ff14;
      }

      .hud-ltc-rate .chip-label {
        color: #00f5ff;
      }

      .hud-aleo-rate .chip-label {
        color: #f8ff00;
      }

      .miners-title {
        display: none;
      }

      .chip-value {
        margin-left: 2px;
        text-align: left;
        font-family: "AlienEncountersBold", sans-serif;
        font-weight: 700;
      }

      .hud-online {
        top: 83%;
        left: 35.5%;
        width: 15%;
        height: 6%;
      }

      .hud-efficiency {
        display: none;
      }

      .hud-power {
        top: 95%;
        left: 78.5%;
        width: 15%;
        height: 6%;
      }

      .hud-offline {
        top: 83%;
        left: 65.5%;
        width: 15%;
        height: 6%;
      }

      .hud-btc-rate {
        top: 42.5%;
        left: 23%;
        width: 15%;
        height: 6%;
      }

      .hud-bch-rate {
        top: 48%;
        left: 23%;
        width: 15%;
        height: 6%;
      }

      .hud-ltc-rate {
        top: 42.5%;
        left: 77%;
        width: 15%;
        height: 6%;
      }

      .hud-aleo-rate {
        top: 48%;
        left: 77%;
        width: 15%;
        height: 6%;
      }

      .hud-solo-pool-hashrate {
        top: 45.25%;
        left: 50%;
        width: 15%;
        height: 6%;
      }

      /* Mobile-specific CSS removed for desktop-only styling */
    `;
  }
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

console.info("%c  CRYPTO-MINER-CARD  %c  v0.1.0  ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: "crypto-miner-card",
  name: "Crypto Miner Card",
  description: "Custom card for monitoring crypto miner fleet",
  preview: true,
  documentationURL: "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/"
});

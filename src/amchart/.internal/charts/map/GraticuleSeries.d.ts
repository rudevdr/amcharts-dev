import { MapLineSeries, IMapLineSeriesSettings, IMapLineSeriesPrivate, IMapLineSeriesDataItem } from "./MapLineSeries";
import type { DataItem } from "../../core/render/Component";
export interface IGraticuleSeriesDataItem extends IMapLineSeriesDataItem {
}
export interface IGraticuleSeriesPrivate extends IMapLineSeriesPrivate {
}
export interface IGraticuleSeriesSettings extends IMapLineSeriesSettings {
    clipExtent?: boolean;
    /**
     * Place a grid line every Xth latitude/longitude.
     *
     * @default 10
     */
    step?: number;
}
/**
 * A [[MapChart]] series to draw a map grid.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/graticule-series/} for more info
 * @important
 */
export declare class GraticuleSeries extends MapLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IGraticuleSeriesSettings;
    _privateSettings: IGraticuleSeriesPrivate;
    protected _dataItem: DataItem<this["_dataItemSettings"]>;
    protected _afterNew(): void;
    _updateChildren(): void;
    protected _generate(): void;
}
//# sourceMappingURL=GraticuleSeries.d.ts.map
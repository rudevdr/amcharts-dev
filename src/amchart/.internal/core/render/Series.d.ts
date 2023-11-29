import { Component, IComponentSettings, IComponentPrivate, DataItem, IComponentEvents, IComponentDataItem } from "../../core/render/Component";
import { List } from "../../core/util/List";
import { Color } from "../../core/util/Color";
import type { Root } from "../../core/Root";
import type { Chart } from "./Chart";
import type { Bullet } from "./Bullet";
import { Container } from "../../core/render/Container";
import type { ILegendDataItem } from "./Legend";
import type { Template } from "../../core/util/Template";
import type { Sprite } from "../../core/render/Sprite";
/**
 * Defines interface for a heat rule.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/} for more info
 */
export interface IHeatRule {
    /**
     * Target template.
     */
    target: Template<any>;
    /**
     * The setting value to use for items if the lowest value.
     */
    min?: any;
    /**
     * The setting value to use for items if the highest value.
     */
    max?: any;
    /**
     * The setting value to use for items which do not have value at all.
     */
    neutral?: any;
    /**
     * Which data field to use when determining item's value.
     */
    dataField: string;
    /**
     * A setting key to set.
     */
    key?: string;
    /**
     * Custom lowest value.
     */
    minValue?: number;
    /**
     * Custom highest value.
     */
    maxValue?: number;
    /**
     * Use logarithmic scale when calculating intermediate setting values.
     *
     * @default false
     */
    logarithmic?: boolean;
    /**
     * A custom function that will set target element's settings.
     *
     * Can be used to do custom manipulation on complex objects requiring more
     * than modifying a setting.
     */
    customFunction?: (target: Sprite, minValue: number, maxValue: number, value?: any) => void;
}
export interface ISeriesDataItem extends IComponentDataItem {
    id?: string;
    value?: number;
    valueWorking?: number;
    valueChange?: number;
    valueChangePercent?: number;
    valueChangeSelection?: number;
    valueChangeSelectionPercent?: number;
    valueChangePrevious?: number;
    valueChangePreviousPercent?: number;
    valueWorkingOpen?: number;
    valueWorkingClose?: number;
    customValue?: number;
    customValueWorking?: number;
    customValueChange?: number;
    customValueChangePercent?: number;
    customValueChangeSelection?: number;
    customValueChangeSelectionPercent?: number;
    customValueChangePrevious?: number;
    customValueChangePreviousPercent?: number;
}
export interface ISeriesSettings extends IComponentSettings {
    /**
     * Name of the series.
     */
    name?: string;
    /**
     * A key to look up in data for an id of the data item.
     */
    idField?: string;
    /**
     * A key to look up in data for a numeric value of the data item.
     *
     * Some series use it to display its elements. It can also be used in heat
     * rules.
     */
    valueField?: string;
    /**
     * A key to look up in data for a numeric customValue of the data item.
     *
     * Usually used for storing additional numeric information and heat rules.
     */
    customValueField?: string;
    /**
     * A text template to be used for label in legend.
     */
    legendLabelText?: string;
    /**
     * A text template to be used for value label in legend.
     */
    legendValueText?: string;
    /**
     * If set to `true` the series initial animation will be played item by item
     * rather than all at once.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series} for more info
     */
    sequencedInterpolation?: boolean;
    /**
     * A delay in milliseconds to wait before starting animation of next data
     * item.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series} for more info
     */
    sequencedDelay?: number;
    /**
     * A list of heat rules to apply on series elements.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/heat-rules/} for more info
     */
    heatRules?: IHeatRule[];
    /**
     * If set to `true`, series will calculate aggregate values, e.g. change
     * percent, high, low, etc.
     *
     * Do not enable unless you are using such aggregate values in tooltips,
     * display data fields, heat rules, or similar.
     */
    calculateAggregates?: boolean;
    /**
     * Series stroke color.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Series_colors} for more info
     */
    stroke?: Color;
    /**
     * Series fill color.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Series_colors} for more info
     */
    fill?: Color;
    /**
     * A data item representing series in a [[Legend]].
     *
     * @readonly
     */
    legendDataItem?: DataItem<ILegendDataItem>;
}
export interface ISeriesPrivate extends IComponentPrivate {
    /**
     * @ignore
     */
    chart?: Chart;
    startIndex?: number;
    endIndex?: number;
    valueAverage?: number;
    valueCount?: number;
    valueSum?: number;
    valueAbsoluteSum?: number;
    valueLow?: number;
    valueHigh?: number;
    valueOpen?: number;
    valueClose?: number;
    customValueAverage?: number;
    customValueCount?: number;
    customValueSum?: number;
    customValueAbsoluteSum?: number;
    customValueLow?: number;
    customValueHigh?: number;
    customValueOpen?: number;
    customValueClose?: number;
    baseValueSeries?: Series;
}
export interface ISeriesEvents extends IComponentEvents {
}
/**
 * A base class for all series.
 */
export declare abstract class Series extends Component {
    static className: string;
    static classNames: Array<string>;
    _settings: ISeriesSettings;
    _privateSettings: ISeriesPrivate;
    _dataItemSettings: ISeriesDataItem;
    _events: ISeriesEvents;
    protected _aggregatesCalculated: boolean;
    protected _selectionAggregatesCalculated: boolean;
    protected _dataProcessed: boolean;
    protected _psi: number | undefined;
    protected _pei: number | undefined;
    /**
     * A chart series belongs to.
     */
    chart: Chart | undefined;
    /**
     * List of bullets to use for the series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/bullets/} for more info
     */
    bullets: List<(<D extends DataItem<this["_dataItemSettings"]>>(root: Root, series: Series, dataItem: D) => Bullet | undefined)>;
    /**
     * A [[Container]] series' bullets are stored in.
     *
     * @default Container.new()
     */
    readonly bulletsContainer: Container;
    protected _afterNew(): void;
    protected _dispose(): void;
    startIndex(): number;
    endIndex(): number;
    protected _handleBullets(dataItems: Array<DataItem<this["_dataItemSettings"]>>): void;
    /**
     * Looks up and returns a data item by its ID.
     *
     * @param   id  ID
     * @return      Data item
     */
    getDataItemById(id: string): DataItem<this["_dataItemSettings"]> | undefined;
    protected _makeBullets(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _shouldMakeBullet(_dataItem: DataItem<this["_dataItemSettings"]>): boolean;
    protected _makeBullet(dataItem: DataItem<this["_dataItemSettings"]>, bulletFunction: (root: Root, series: Series, dataItem: DataItem<this["_dataItemSettings"]>) => Bullet | undefined, index?: number): Bullet | undefined;
    protected _makeBulletReal(dataItem: DataItem<this["_dataItemSettings"]>, bullet: Bullet): void;
    /**
     * Adds bullet directly to a data item.
     *
     * Please note: method accepts [[Bullet]] instance as a paramter, not a
     * reference to a function.
     *
     * You should add Bullet instance, not a method like you do it on series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/bullets/#Adding_directly_to_data_item} for more info
     * @since 5.6.0
     *
     * @param  dataItem  Target data item
     * @param  bullet    Bullet instance
     */
    addBullet(dataItem: DataItem<this["_dataItemSettings"]>, bullet: Bullet): void;
    _clearDirty(): void;
    _prepareChildren(): void;
    protected _calculateAggregates(startIndex: number, endIndex: number): void;
    _updateChildren(): void;
    _positionBullets(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _hideBullets(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _positionBullet(_bullet: Bullet): void;
    _placeBulletsContainer(chart: Chart): void;
    _removeBulletsContainer(): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _getItemReaderLabel(): string;
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    protected _sequencedShowHide(show: boolean, duration?: number): Promise<void>;
    /**
     * @ignore
     */
    updateLegendValue(dataItem?: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    updateLegendMarker(_dataItem?: DataItem<this["_dataItemSettings"]>): void;
    protected _onHide(): void;
    /**
     * @ignore
     */
    hoverDataItem(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    unhoverDataItem(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    _getBase(key: any): number;
}
//# sourceMappingURL=Series.d.ts.map
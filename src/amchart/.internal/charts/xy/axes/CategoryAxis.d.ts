import type { DataItem } from "../../../core/render/Component";
import type { AxisRenderer } from "./AxisRenderer";
import { Axis, IAxisSettings, IAxisPrivate, IAxisDataItem, IAxisEvents } from "./Axis";
import type { IXYSeriesDataItem, XYSeries } from "../series/XYSeries";
import type { Tooltip } from "../../../core/render/Tooltip";
export interface ICategoryAxisSettings<R extends AxisRenderer> extends IAxisSettings<R> {
    /**
     * A function that can be used to specify how to configure axis fills.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_fills} for more info
     */
    fillRule?: (dataItem: DataItem<ICategoryAxisDataItem>, index?: number) => void;
    /**
     * A field in data which holds categories.
     */
    categoryField: string;
    /**
     * Relative location of where axis cell starts: 0 - beginning, 1 - end.
     *
     * @default 0
     */
    startLocation?: number;
    /**
     * Relative location of where axis cell ends: 0 - beginning, 1 - end.
     *
     * @default 1
     */
    endLocation?: number;
}
export interface ICategoryAxisDataItem extends IAxisDataItem {
    /**
     * Named category.
     */
    category?: string;
    /**
     * Named end category (for axis items that span multiple categories, like
     * axis ranges).
     */
    endCategory?: string;
    /**
     * Index of the data item.
     */
    index?: number;
    /**
     * Relative location of the category within cell: 0 - start, 1 - end.
     */
    categoryLocation?: number;
    /**
     * Relative location of the end category within cell: 0 - start, 1 - end.
     */
    endCategoryLocation?: number;
    /**
     * A distance to shift data item relative to its original position.
     *
     * The value is 0 to 1, where 1 is full witdth of the axis.
     *
     * Can be used to sort data items without modifying order of the actual data.
     */
    deltaPosition?: number;
}
export interface ICategoryAxisPrivate extends IAxisPrivate {
    /**
     * Start index of the current zoom scope.
     */
    startIndex?: number;
    /**
     * End index of the current zoom scope.
     */
    endIndex?: number;
}
export interface ICategoryAxisEvents extends IAxisEvents {
}
/**
 * Creates a category axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/category-axis/} for more info
 * @important
 */
export declare class CategoryAxis<R extends AxisRenderer> extends Axis<R> {
    static className: string;
    static classNames: Array<string>;
    _settings: ICategoryAxisSettings<R>;
    _privateSettings: ICategoryAxisPrivate;
    _dataItemSettings: ICategoryAxisDataItem;
    _events: ICategoryAxisEvents;
    protected _frequency: number;
    protected _itemMap: {
        [index: string]: DataItem<ICategoryAxisDataItem>;
    };
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _handleRangeChange(): void;
    protected _prepareAxisItems(): void;
    _prepareDataItem(dataItem: DataItem<this["_dataItemSettings"]>, fillIndex?: number, count?: number): void;
    startIndex(): number;
    endIndex(): number;
    /**
     * @ignore
     */
    baseValue(): any;
    /**
     * @ignore
     */
    basePosition(): number;
    /**
     * Returns X coordinate in pixels corresponding to specific category index.
     *
     * @param   value  Index
     * @return         X coordinate
     */
    getX(value: string): number;
    /**
     * Returns Y coordinate in pixels corresponding to specific category index.
     *
     * @param   value  Index
     * @return         Y coordinate
     */
    getY(value: string): number;
    /**
     * @ignore
     */
    getDataItemPositionX(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    getDataItemCoordinateX(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    getDataItemPositionY(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    getDataItemCoordinateY(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, _axisLocation?: number): number;
    /**
     * Converts category index to a relative position.
     *
     * `location` indicates relative position within category: 0 - start, 1 - end.
     *
     * If not set, will use middle (0.5) of the category.
     *
     * @param   index     Index
     * @param   location  Location
     * @return            Index
     */
    indexToPosition(index: number, location?: number): number;
    /**
     * Returns an index of a category.
     *
     * @param   category  Category to look up
     * @return            Index
     */
    categoryToIndex(category: string): number;
    /**
     * @ignore
     */
    dataItemToPosition(dataItem: DataItem<this["_dataItemSettings"]>): number;
    /**
     * @ignore
     */
    roundAxisPosition(position: number, location: number): number;
    /**
     * Returns an index of the category that corresponds to specific pixel
     * position within axis.
     *
     * @param position  Position (px)
     * @return Category index
     */
    axisPositionToIndex(position: number): number;
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position  Position
     * @return            Tooltip text
     */
    getTooltipText(position: number, _adjustPosition?: boolean): string | undefined;
    protected _updateTooltipText(tooltip: Tooltip, position: number): void;
    /**
     * Returns a data item from series that is closest to the `position`.
     *
     * @param   series    Series
     * @param   position  Relative position
     * @return            Data item
     */
    getSeriesItem(series: XYSeries, position: number): DataItem<IXYSeriesDataItem> | undefined;
    /**
     * Zooms the axis to specific `start` and `end` indexes.
     *
     * Optional `duration` specifies duration of zoom animation in milliseconds.
     *
     * @param  start     Start index
     * @param  end       End index
     * @param  duration  Duration in milliseconds
     */
    zoomToIndexes(start: number, end: number, duration?: number): void;
    zoomToCategories(startCategory: string, endCategory: string, duration?: number): void;
    /**
     * Returns position span between start and end of a single cell in axis.
     *
     * @since 5.2.30
     * @return Position
     */
    getCellWidthPosition(): number;
}
//# sourceMappingURL=CategoryAxis.d.ts.map
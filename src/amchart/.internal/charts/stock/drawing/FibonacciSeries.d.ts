import type { Graphics } from "../../../core/render/Graphics";
import type { DataItem } from "../../../core/render/Component";
import type { Color } from "../../../core/util/Color";
import { SimpleLineSeries, ISimpleLineSeriesSettings, ISimpleLineSeriesPrivate, ISimpleLineSeriesDataItem } from "./SimpleLineSeries";
import { Label } from "../../../core/render/Label";
import { ListTemplate } from "../../../core/util/List";
export interface IFibonacciSeriesDataItem extends ISimpleLineSeriesDataItem {
}
export interface IFibonacciSeriesSettings extends ISimpleLineSeriesSettings {
    /**
     * Sequence.
     */
    sequence?: Array<number>;
    /**
     * Array of colors to use for bands.
     */
    colors?: Array<Color>;
}
export interface IFibonacciSeriesPrivate extends ISimpleLineSeriesPrivate {
}
export declare class FibonacciSeries extends SimpleLineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IFibonacciSeriesSettings;
    _privateSettings: IFibonacciSeriesPrivate;
    _dataItemSettings: IFibonacciSeriesDataItem;
    protected _tag: string;
    protected _labels: Array<Array<Label>>;
    protected _fills: Array<Array<Graphics>>;
    protected _strokes: Array<Array<Graphics>>;
    /**
     * @ignore
     */
    makeLabel(): Label;
    /**
     * A list of labels.
     *
     * `labels.template` can be used to configure axis labels.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    _updateChildren(): void;
    protected _updateChildrenReal(): void;
    protected _createElements(index: number): void;
    protected _drawFill(): void;
    protected _drawStroke(): void;
    protected _updateLine(): void;
    protected _clearGraphics(): void;
    enableDrawing(): void;
    enableErasing(): void;
    protected _hideAllBullets(): void;
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=FibonacciSeries.d.ts.map
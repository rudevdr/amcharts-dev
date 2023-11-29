import type { IPoint } from "../../../core/util/IPoint";
import type { Line } from "../../../core/render/Line";
import type { Graphics } from "../../../core/render/Graphics";
import { RectangleSeries, IRectangleSeriesSettings, IRectangleSeriesPrivate, IRectangleSeriesDataItem } from "./RectangleSeries";
import { ListTemplate } from "../../../core/util/List";
import { Label } from "../../../core/render/Label";
export interface IMeasureDataItem extends IRectangleSeriesDataItem {
}
export interface IMeasureSettings extends IRectangleSeriesSettings {
    labelText?: string;
    labelVolumeText?: string;
}
export interface IMeasurePrivate extends IRectangleSeriesPrivate {
}
export declare class Measure extends RectangleSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IMeasureSettings;
    _privateSettings: IMeasurePrivate;
    _dataItemSettings: IMeasureDataItem;
    protected _lines: Array<Line>;
    protected _labels: Array<Label>;
    protected _tag: string;
    _afterNew(): void;
    /**
     * A list of labels.
     *
     * `labels.template` can be used to configure axis labels.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    /**
     * @ignore
     */
    makeLabel(): Label;
    protected _createElements(index: number): void;
    protected _disposeIndex(index: number): void;
    protected _updateOthers(index: number, fillGraphics: Graphics, p1: IPoint, p2: IPoint): void;
}
//# sourceMappingURL=Measure.d.ts.map
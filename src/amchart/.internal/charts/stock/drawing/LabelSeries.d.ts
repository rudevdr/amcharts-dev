import type { ISpritePointerEvent } from "../../../core/render/Sprite";
import type { Container } from "../../../core/render/Container";
import type { DataItem } from "../../../core/render/Component";
import { PolylineSeries, IPolylineSeriesSettings, IPolylineSeriesPrivate, IPolylineSeriesDataItem } from "./PolylineSeries";
import { Label } from "../../../core/render/Label";
import { SpriteResizer } from "../../../core/render/SpriteResizer";
import { Color } from "../../../core/util/Color";
import { Template } from "../../../core/util/Template";
export interface ILabelSeriesDataItem extends IPolylineSeriesDataItem {
}
export interface ILabelSeriesSettings extends IPolylineSeriesSettings {
    /**
     * Label font size.
     */
    labelFontSize?: number | string | undefined;
    /**
     * Label font damily.
     */
    labelFontFamily?: string;
    /**
     * Font weight.
     */
    labelFontWeight?: "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    /**
     * Font style.
     */
    labelFontStyle?: "normal" | "italic" | "oblique";
    /**
     * Label color.
     */
    labelFill?: Color;
}
export interface ILabelSeriesPrivate extends IPolylineSeriesPrivate {
    inputContainer: HTMLDivElement;
    input: HTMLTextAreaElement;
    label: Label;
}
export declare class LabelSeries extends PolylineSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: ILabelSeriesSettings;
    _privateSettings: ILabelSeriesPrivate;
    _dataItemSettings: ILabelSeriesDataItem;
    spriteResizer: SpriteResizer;
    protected _clickEvent?: ISpritePointerEvent;
    protected _tag: string;
    protected _afterNew(): void;
    protected _tweakBullet(container: Container, dataItem: DataItem<ILabelSeriesDataItem>): void;
    protected _tweakBullet2(label: Label, _dataItem: DataItem<ILabelSeriesDataItem>): void;
    protected _handlePointerClick(event: ISpritePointerEvent): void;
    saveText(): void;
    protected _afterTextSave(_dataContext: any): void;
    protected _getLabelTemplate(): Template<any>;
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _hideAllBullets(): void;
}
//# sourceMappingURL=LabelSeries.d.ts.map
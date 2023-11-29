import type { DataItem } from "../../core/render/Component";
import { Chord, IChordSettings, IChordDataItem, IChordPrivate, IChordEvents } from "./Chord";
import { ChordLinkDirected } from "./ChordLinkDirected";
import { RibbonArrowGenerator, Ribbon, RibbonSubgroup } from "d3-chord";
import { ListTemplate } from "../../core/util/List";
export interface IChordDirectedDataItem extends IChordDataItem {
}
export interface IChordDirectedSettings extends IChordSettings {
    /**
     * Length of the link arrow in pixels.
     *
     * Set to `null` to disable arrowheads.
     *
     * @default 10
     */
    linkHeadRadius?: number | undefined;
}
export interface IChordDirectedPrivate extends IChordPrivate {
}
export interface IChordDirectedEvents extends IChordEvents {
}
/**
 * Directed chord series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export declare class ChordDirected extends Chord {
    static className: string;
    static classNames: Array<string>;
    _settings: IChordDirectedSettings;
    _privateSettings: IChordDirectedPrivate;
    _dataItemSettings: IChordDirectedDataItem;
    _events: IChordDirectedEvents;
    _d3chord: import("d3-chord").ChordLayout;
    _ribbonArrow: RibbonArrowGenerator<any, Ribbon, RibbonSubgroup>;
    /**
     * List of link elements.
     *
     * @default new ListTemplate<ChordLinkDirected>
     */
    readonly links: ListTemplate<ChordLinkDirected>;
    /**
     * @ignore
     */
    makeLink(dataItem: DataItem<this["_dataItemSettings"]>): ChordLinkDirected;
    protected _afterNew(): void;
    _prepareChildren(): void;
}
//# sourceMappingURL=ChordDirected.d.ts.map
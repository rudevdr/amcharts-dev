import type { ChordLink } from "./ChordLink";
import type { RibbonGenerator, RibbonSubgroup, Ribbon } from "d3-chord";
import { Chord, IChordSettings, IChordDataItem, IChordPrivate, IChordEvents } from "./Chord";
export interface IChordNonRibbonDataItem extends IChordDataItem {
}
export interface IChordNonRibbonSettings extends IChordSettings {
    /**
     * Type of the link:
     *
     * `"curve"` (default) will display link as a curved line.
     * `"line"` will display link as a straight line.
     *
     * @default "curve"
     */
    linkType?: "curve" | "line";
}
export interface IChordNonRibbonPrivate extends IChordPrivate {
}
export interface IChordNonRibbonEvents extends IChordEvents {
}
/**
 * Chord series with think line links.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export declare class ChordNonRibbon extends Chord {
    static className: string;
    static classNames: Array<string>;
    _settings: IChordNonRibbonSettings;
    _privateSettings: IChordNonRibbonPrivate;
    _dataItemSettings: IChordNonRibbonDataItem;
    protected _afterNew(): void;
    protected _makeMatrix(): number[][];
    protected _updateLink(_ribbon: RibbonGenerator<any, Ribbon, RibbonSubgroup>, link: ChordLink, _linkRadius: number, chordLayoutItem: any): void;
    protected _getLinkPoints(link: ChordLink, linkRadius: number, _chordLayoutItem: any): void;
}
//# sourceMappingURL=ChordNonRibbon.d.ts.map
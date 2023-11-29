import type { DataItem } from "../../core/render/Component";
import type { ChordDirected, IChordDirectedDataItem } from "./ChordDirected";
import { ChordLink, IChordLinkPrivate, IChordLinkSettings } from "./ChordLink";
export interface IChordLinkDirectedSettings extends IChordLinkSettings {
    /**
     * Length of the link arrow in pixels.
     *
     * @default 10
     */
    headRadius?: number;
}
export interface IChordLinkDirectedPrivate extends IChordLinkPrivate {
}
/**
 * A link element used in [[ChordDirected]] chart.
 */
export declare class ChordLinkDirected extends ChordLink {
    _settings: IChordLinkDirectedSettings;
    _privateSettings: IChordLinkDirectedPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _dataItem: DataItem<IChordDirectedDataItem> | undefined;
    series: ChordDirected | undefined;
    protected _afterNew(): void;
}
//# sourceMappingURL=ChordLinkDirected.d.ts.map
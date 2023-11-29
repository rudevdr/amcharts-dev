import { Layout, ILayoutSettings, ILayoutPrivate } from "./Layout";
import type { Container } from "./Container";
export interface IGridLayoutSettings extends ILayoutSettings {
    /**
     * If set to `true` all columns in the grid will be equal width.
     *
     * @default false
     */
    fixedWidthGrid?: boolean;
    /**
     * Maximum number of columns in the grid.
     */
    maxColumns?: number;
}
export interface IGridLayoutPrivate extends ILayoutPrivate {
}
/**
 * A grid children layout for [[Container]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/containers/#Layout} for more info
 */
export declare class GridLayout extends Layout {
    static className: string;
    static classNames: Array<string>;
    _settings: IGridLayoutSettings;
    _privateSettings: IGridLayoutPrivate;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    updateContainer(container: Container): void;
    /**
     * @ignore
     */
    getColumnWidths(container: Container, columnCount: number, maxCellWidth: number, availableWidth: number): number[];
}
//# sourceMappingURL=GridLayout.d.ts.map
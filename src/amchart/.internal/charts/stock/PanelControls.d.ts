import type { StockChart } from "./StockChart";
import type { StockPanel } from "./StockPanel";
import { Container, IContainerPrivate, IContainerSettings } from "../../core/render/Container";
import { Button } from "../../core/render/Button";
export interface IPanelControlsSettings extends IContainerSettings {
    /**
     * A target [[StockChart]].
     */
    stockChart: StockChart;
    /**
     * A target [[StockPanel]].
     */
    stockPanel: StockPanel;
}
export interface IPanelControlsPrivate extends IContainerPrivate {
}
/**
 * Creates a button set for [[StockChart]] panels (move up/down, close, etc.)
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/panels/#Panel_controls} for more info
 */
export declare class PanelControls extends Container {
    _settings: IPanelControlsSettings;
    _privateSettings: IPanelControlsPrivate;
    static className: string;
    static classNames: Array<string>;
    /**
     * A [[Button]] which moves panel up.
     *
     * @default Button.new()
     */
    upButton: Button;
    /**
     * A [[Button]] which moves panel down.
     *
     * @default Button.new()
     */
    downButton: Button;
    /**
     * A [[Button]] which expands/collapses the panel.
     *
     * @default Button.new()
     */
    expandButton: Button;
    /**
     * A [[Button]] which closes the panel.
     *
     * @default Button.new()
     */
    closeButton: Button;
    protected _afterNew(): void;
}
//# sourceMappingURL=PanelControls.d.ts.map
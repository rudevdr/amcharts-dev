import type { XYSeries } from "../../xy/series/XYSeries";
import type { Color } from "../../../core/util/Color";
import type { ColorSet } from "../../../core/util/ColorSet";
import { Template } from "../../../core/util/Template";
import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { DrawingToolControl, DrawingTools } from "./DrawingToolControl";
import { ColorControl } from "./ColorControl";
import { DropdownListControl } from "./DropdownListControl";
import { IconControl, IIcon } from "./IconControl";
import { DrawingSeries } from "../drawing/DrawingSeries";
export interface IDrawingControlSettings extends IStockControlSettings {
    /**
     * List of tools available in drawing mode.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/drawing-control/#Tool_list} for more info
     */
    tools?: DrawingTools[];
    /**
     * Default tool.
     */
    tool?: DrawingTools;
    /**
     * Default settings for drawing tools.
     *
     * @since 5.5.2
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/drawing-control/#Tool_settings} for more info
     */
    toolSettings?: {
        [index: string]: any;
    };
    /**
     * Target series for drawing.
     */
    series?: XYSeries[];
    /**
     * Colors to show in color pickers.
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/drawing-control/#Colors} for more info
     */
    colors?: ColorSet;
    /**
     * Default color for lines/borders.
     */
    strokeColor?: Color;
    /**
     * Default line/border width in pixels.
     */
    strokeWidth?: number;
    /**
     * Available line widths for user to choose from.
     */
    strokeWidths?: number[];
    /**
     * Default dasharray setting.
     */
    strokeDasharray?: number[];
    /**
     * Available line dash settings for user to choose from.
     */
    strokeDasharrays?: number[][];
    /**
     * Default line/border opacity.
     */
    strokeOpacity?: number;
    /**
     * Show dotted/thin line extending from both ends of the drawn line?
     *
     * @default true
     */
    showExtension?: boolean;
    /**
     * Default fill color.
     */
    fillColor?: Color;
    /**
     * Default fill opacity.
     */
    fillOpacity?: number;
    /**
     * Default color for labels.
     */
    labelFill?: Color;
    /**
     * Default label font size.
     */
    labelFontSize?: number | string | undefined;
    /**
     * Available font sizes.
     */
    labelFontSizes?: Array<number | string>;
    /**
     * Default label font.
     */
    labelFontFamily?: string;
    /**
     * Available fonts for user to choose from.
     */
    labelFontFamilies?: string[];
    /**
     * Default label font weight.
     */
    labelFontWeight?: "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    /**
     * Default label style.
     */
    labelFontStyle?: "normal" | "italic" | "oblique";
    drawingIcon?: IIcon;
    drawingIcons?: IIcon[];
    /**
     * Should drawings snap to the nearest data point?
     *
     * @default true
     */
    snapToData?: boolean;
}
export interface IDrawingControlPrivate extends IStockControlPrivate {
    toolsContainer?: HTMLDivElement;
    toolControl?: DrawingToolControl;
    eraserControl?: StockControl;
    clearControl?: StockControl;
    strokeControl?: ColorControl;
    strokeWidthControl?: DropdownListControl;
    strokeDasharrayControl?: DropdownListControl;
    fillControl?: ColorControl;
    extensionControl?: StockControl;
    labelFillControl?: ColorControl;
    labelFontSizeControl?: DropdownListControl;
    labelFontFamilyControl?: DropdownListControl;
    boldControl?: StockControl;
    italicControl?: StockControl;
    iconControl?: IconControl;
    snapControl?: StockControl;
    toolTemplates?: {
        [index: string]: Template<any>;
    };
}
export interface IDrawingControlEvents extends IStockControlEvents {
}
/**
 * A drawing tools control for [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/drawing-control/} for more info
 */
export declare class DrawingControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IDrawingControlSettings;
    _privateSettings: IDrawingControlPrivate;
    _events: IDrawingControlEvents;
    private _drawingSeries;
    private _currentEnabledSeries;
    private _initedPanels;
    protected _afterNew(): void;
    protected _initElements(): void;
    protected _isInited(): boolean;
    protected _resetControls(): void;
    protected _initToolbar(): void;
    /**
     * Enables or disables eraser tool.
     *
     * @since 5.3.9
     * @param  active  Eraser active
     */
    setEraser(active: boolean): void;
    /**
     * Clears all drawings.
     *
     * @since 5.3.9
     */
    clearDrawings(): void;
    _beforeChanged(): void;
    protected _setTool(tool?: DrawingTools): void;
    protected _maybeInitToolSeries(tool: DrawingTools): void;
    protected _setStroke(): void;
    protected _setFill(): void;
    protected _setLabel(): void;
    protected _setExtension(): void;
    protected _setDrawingIcon(): void;
    protected _setSnap(): void;
    protected _getDefaultIcon(): SVGElement;
    protected _dispose(): void;
    protected _getSeriesTool(series: DrawingSeries): DrawingTools | undefined;
    /**
     * Serializes all drawings into an array of simple objects or JSON.
     *
     * `output` parameter can either be `"object"` or `"string"` (default).
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param   output Output format
     * @param   indent Line indent in JSON
     * @return         Serialized indicators
     */
    serializeDrawings(output?: "object" | "string", indent?: string): Array<unknown> | string;
    /**
     * Parses data serialized with `serializeDrawings()` and adds drawings to the
     * chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param  data Serialized data
     */
    unserializeDrawings(data: string | Array<any>): void;
}
//# sourceMappingURL=DrawingControl.d.ts.map
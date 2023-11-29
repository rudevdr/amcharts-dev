import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { DropdownList } from "./DropdownList";
export declare type DrawingTools = "Arrows &amp; Icons" | "Average" | "Callout" | "Doodle" | "Ellipse" | "Fibonacci" | "Fibonacci Timezone" | "Horizontal Line" | "Horizontal Ray" | "Label" | "Line" | "Measure" | "Parallel Channel" | "Polyline" | "Quadrant Line" | "Rectangle" | "Regression" | "Trend Line" | "Vertical Line";
export interface IDrawingToolControlSettings extends IStockControlSettings {
    tools: DrawingTools[];
}
export interface IDrawingToolControlPrivate extends IStockControlPrivate {
    list?: DropdownList;
}
export interface IDrawingToolControlEvents extends IStockControlEvents {
    selected: {
        tool: DrawingTools;
    };
}
/**
 * Control which allows selecting drawing tool.
 *
 * Should not be instantiated directly. Use [[DrawingControl]] instead.
 */
export declare class DrawingToolControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IDrawingToolControlSettings;
    _privateSettings: IDrawingToolControlPrivate;
    _events: IDrawingToolControlEvents;
    protected _afterNew(): void;
    setTool(tool: DrawingTools): void;
    protected _initTools(): void;
    protected _getToolIcon(tool: DrawingTools): SVGElement;
    _afterChanged(): void;
    protected _dispose(): void;
}
//# sourceMappingURL=DrawingToolControl.d.ts.map
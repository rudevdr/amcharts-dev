import type { MapLineSeries } from "./MapLineSeries";
import type { IGeoPoint } from "../../core/util/IGeoPoint";
import type { IPoint } from "../../core/util/IPoint";
import { Graphics, IGraphicsSettings, IGraphicsPrivate, IGraphicsEvents } from "../../core/render/Graphics";
export interface IMapLineSettings extends IGraphicsSettings {
    /**
     * A GeoJSON representation of the polygons geometry.
     */
    geometry?: GeoJSON.LineString | GeoJSON.MultiLineString;
    /**
     * @todo needs description
     * @default 0.5
     */
    precision?: number;
}
export interface IMapLinePrivate extends IGraphicsPrivate {
    /**
     * @ignore
     */
    series: MapLineSeries;
}
export interface IMapLineEvents extends IGraphicsEvents {
    /**
     * Invoked when line is redrawn
     */
    linechanged: {};
}
/**
 * A line object in a [[MapLineSeries]].
 */
export declare class MapLine extends Graphics {
    _settings: IMapLineSettings;
    _privateSettings: IMapLinePrivate;
    _events: IMapLineEvents;
    static className: string;
    static classNames: Array<string>;
    protected _projectionDirty: boolean;
    _beforeChanged(): void;
    /**
     * @ignore
     */
    markDirtyProjection(): void;
    _clearDirty(): void;
    _getTooltipPoint(): IPoint;
    /**
     * Converts relative position along the line (0-1) into pixel coordinates.
     *
     * @param position  Position (0-1)
     * @return Coordinates
     */
    positionToGeoPoint(position: number): IGeoPoint;
}
//# sourceMappingURL=MapLine.d.ts.map
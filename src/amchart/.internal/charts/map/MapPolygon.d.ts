import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "../../core/render/Graphics";
import type { MapPolygonSeries } from "./MapPolygonSeries";
import type { IGeoPoint } from "../../core/util/IGeoPoint";
import type { IPoint } from "../../core/util/IPoint";
export interface IMapPolygonSettings extends IGraphicsSettings {
    /**
     * A GeoJSON representation of the polygons geometry.
     */
    geometry?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
    /**
     * @todo needs description
     * @default 0.5
     */
    precision?: number;
}
export interface IMapPolygonPrivate extends IGraphicsPrivate {
}
/**
 * A polygon in a [[MapPolygonSeries]].
 */
export declare class MapPolygon extends Graphics {
    _settings: IMapPolygonSettings;
    _privateSettings: IMapPolygonPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _projectionDirty: boolean;
    /**
     * A [[MapPolygonSeries]] polygon belongs to.
     */
    series: MapPolygonSeries | undefined;
    _beforeChanged(): void;
    /**
     * @ignore
     */
    markDirtyProjection(): void;
    _clearDirty(): void;
    /**
     * Returns latitude/longitude of the geometrical center of the polygon.
     *
     * @return Center
     */
    geoCentroid(): IGeoPoint;
    /**
     * Returns latitude/longitude of the visual center of the polygon.
     *
     * @return Center
     */
    visualCentroid(): IGeoPoint;
    _getTooltipPoint(): IPoint;
}
//# sourceMappingURL=MapPolygon.d.ts.map
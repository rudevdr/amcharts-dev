import type { IGeoPoint } from "../../core/util/IGeoPoint";
/**
 * Returns a GeoJSON representation of a circle, suitable for use as `geometry` value
 * in a [[MapPolygon]] in a [[MapPolygonSeries]].
 *
 * @param   geoPoint  Coordinates
 * @param   radius    Circle radius in degrees
 * @return            Polygon geometry
 */
export declare function getGeoCircle(geoPoint: IGeoPoint, radius: number): GeoJSON.Polygon;
/**
 * Returns geo centroid of a geometry
 */
export declare function getGeoCentroid(geometry: GeoJSON.GeometryObject): IGeoPoint;
/**
 * Returns geo area of a geometry
 */
export declare function getGeoArea(geometry: GeoJSON.GeometryObject): number;
/**
 * Returns bounds of a geometry
 */
export declare function getGeoBounds(geometry: GeoJSON.GeometryObject): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
/**
 * Returns a GeoJSON representation of a rectangle, suitable for use
 * as `geometry` value in a [[MapPolygon]] in a [[MapPolygonSeries]].
 *
 * @param   north  North latitude
 * @param   east   East longitude
 * @param   south  South latitude
 * @param   west   West longitude
 * @return         polygon geometry
 */
export declare function getGeoRectangle(north: number, east: number, south: number, west: number): GeoJSON.MultiPolygon;
/**
 * Update longitudes and latitudes that wrap around -180/180 and -90/90 values.
 *
 * @param   geoPoint  Input coordinates
 * @return            Updated coordinates
 */
export declare function normalizeGeoPoint(geoPoint: IGeoPoint): IGeoPoint;
/**
 * @ignore
 */
export declare function wrapAngleTo180(angle: number): number;
//# sourceMappingURL=MapUtils.d.ts.map
import type { MapSeries } from "./MapSeries";
import type { GeoProjection, GeoPath } from "d3-geo";
import type { IPoint } from "../../core/util/IPoint";
import type { IGeoPoint } from "../../core/util/IGeoPoint";
import type { Time } from "../../core/util/Animation";
import type { ZoomControl } from "./ZoomControl";
import type { Animation } from "../../core/util/Entity";
import type { DataItem } from "../../core/render/Component";
import type { IMapPolygonSeriesDataItem } from "./MapPolygonSeries";
import { SerialChart, ISerialChartPrivate, ISerialChartSettings, ISerialChartEvents } from "../../core/render/SerialChart";
import type { IDisposer } from "../../core/util/Disposer";
import type { ISpritePointerEvent } from "../../core/render/Sprite";
export interface IMapChartSettings extends ISerialChartSettings {
    /**
     * A projection to use when plotting the map.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/#Projections} for more info
     */
    projection?: GeoProjection;
    /**
     * Current zoom level.
     */
    zoomLevel?: number;
    /**
     * current x position of a map
     */
    translateX?: number;
    /**
     * current y position of a map
     */
    translateY?: number;
    /**
     * Vertical centering of the map.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/#Centering_the_map} for more info
     */
    rotationY?: number;
    /**
     * Horizontal centering of the map.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/#Centering_the_map} for more info
     */
    rotationX?: number;
    /**
     * Depth centering of the map.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/#Centering_the_map} for more info
     */
    rotationZ?: number;
    /**
     * Highest zoom level map is allowed to zoom in to.
     *
     * @deault 32
     */
    maxZoomLevel?: number;
    /**
     * Lowest zoom level map is allowed to zoom in to.
     *
     * @deault 1
     */
    minZoomLevel?: number;
    /**
     * Increment zoom level by `zoomStep` when user zooms in via [[ZoomControl]] or
     * API.
     *
     * @default 2
     */
    zoomStep?: number;
    /**
     * Defines what happens when map is being dragged horizontally.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Panning} for more info
     * @default "translateX"
     */
    panX?: "none" | "rotateX" | "translateX";
    /**
     * Defines what happens when map is being dragged vertically.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Panning} for more info
     * @default "translateY"
     */
    panY?: "none" | "rotateY" | "translateY";
    /**
     * Enables pinch-zooming of the map on multi-touch devices.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Pinch_zoom} for more info
     * @default true
     */
    pinchZoom?: boolean;
    /**
     * Defines what happens when horizontal mouse wheel (only some mouses do have such a wheel)
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Mouse_wheel_behavior} for more info
     * @default "none"
     */
    wheelX?: "none" | "zoom" | "rotateX" | "rotateY";
    /**
     * Defines what happens when mouse wheel is turned.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Mouse_wheel_behavior} for more info
     * @default "zoom"
     */
    wheelY?: "none" | "zoom" | "rotateX" | "rotateY";
    /**
     * Sensitivity of a mouse wheel.
     *
     * @default 1
     */
    wheelSensitivity?: number;
    /**
     * Duration of mouse-wheel action animation, in milliseconds.
     */
    wheelDuration?: number;
    /**
     * An easing function to use for mouse wheel action animations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     * @default am5.ease.out($ease.cubic)
     */
    wheelEasing?: (t: Time) => Time;
    /**
     * Duration of zoom/pan animations, in milliseconds.
     */
    animationDuration?: number;
    /**
     * An easing function to use for zoom/pan animations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     * @default am5.ease.out($ease.cubic)
     */
    animationEasing?: (t: Time) => Time;
    /**
     * A [[ZoomControl]] instance.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/#Zoom_control} for more info
     */
    zoomControl?: ZoomControl;
    /**
     * Initial/home zoom level.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Initial_position_and_zoom} for more info
     */
    homeZoomLevel?: number;
    /**
     * Initial/home rotationX.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Initial_position_and_zoom} for more info
     */
    homeRotationX?: number;
    /**
     * Initial/home rotationY.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Initial_position_and_zoom} for more info
     */
    homeRotationY?: number;
    /**
     * Initial coordinates to center map on load or `goHome()` call.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Initial_position_and_zoom} for more info
     */
    homeGeoPoint?: IGeoPoint;
    /**
     * How much of a map can go outside the viewport.
     *
     * @default 0.4
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Panning_outside_viewport} for more info
     */
    maxPanOut?: number;
    /**
     * Setting `true` means that the map will automatically center itself (or go
     * to `homeGeoPoint` if set) when fully zoomed out.
     *
     * `false` would mean that zoom out will be centered around the mouse
     * cursor (when zooming using wheel), or current map position.
     *
     * @default true
     * @since 5.2.1
     */
    centerMapOnZoomOut?: boolean;
}
export interface IMapChartPrivate extends ISerialChartPrivate {
    /**
     * @ignore
     */
    geoPath: GeoPath;
    /**
     * @ignore
     */
    mapScale: number;
}
export interface IMapChartEvents extends ISerialChartEvents {
    /**
     * Invoked when geo bounds of the map change, usually after map is
     * initialized.
     */
    geoboundschanged: {};
}
export declare class MapChart extends SerialChart {
    static className: string;
    static classNames: Array<string>;
    _settings: IMapChartSettings;
    _privateSettings: IMapChartPrivate;
    _seriesType: MapSeries;
    _events: IMapChartEvents;
    protected _downTranslateX: number | undefined;
    protected _downTranslateY: number | undefined;
    protected _downRotationX: number | undefined;
    protected _downRotationY: number | undefined;
    protected _downRotationZ: number | undefined;
    protected _pLat: number;
    protected _pLon: number;
    protected _movePoints: {
        [index: number]: IPoint;
    };
    protected _downZoomLevel: number;
    protected _doubleDownDistance: number;
    protected _dirtyGeometries: boolean;
    protected _geometryColection: GeoJSON.GeometryCollection;
    _centerLocation: [number, number] | null;
    protected _za?: Animation<this["_settings"]["zoomLevel"]>;
    protected _rxa?: Animation<this["_settings"]["rotationX"]>;
    protected _rya?: Animation<this["_settings"]["rotationY"]>;
    protected _txa?: Animation<this["_settings"]["translateX"]>;
    protected _tya?: Animation<this["_settings"]["translateY"]>;
    protected _mapBounds: number[][];
    protected _geoCentroid: IGeoPoint;
    protected _geoBounds: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    protected _prevGeoBounds: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    protected _dispatchBounds: boolean;
    protected _wheelDp: IDisposer | undefined;
    protected _pw?: number;
    protected _ph?: number;
    protected _mapFitted: boolean;
    protected _centerX: number;
    protected _centerY: number;
    protected _makeGeoPath(): void;
    /**
     * Returns a geoPoint of the current zoom position.
     *
     * You can later use it to restore zoom position, e.g.: `chart.zoomToGeoPoint(geoPoint, zoomLevel, true)`.
     *
     * @since 5.2.19
     */
    geoPoint(): IGeoPoint;
    /**
     * Returns coordinates to geographical center of the map.
     */
    geoCentroid(): IGeoPoint;
    /**
     * Returns geographical bounds of the map.
     */
    geoBounds(): {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    protected _handleSetWheel(): void;
    _prepareChildren(): void;
    protected _fitMap(): void;
    /**
     * Returns geographical coordinates for calculated or manual center of the
     * map.
     */
    homeGeoPoint(): IGeoPoint;
    /**
     * Repositions the map to the "home" zoom level and center coordinates.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Resetting_position_level} for more info
     * @param  duration  Animation duration in milliseconds
     */
    goHome(duration?: number): void;
    _updateChildren(): void;
    _afterChanged(): void;
    protected _setUpTouch(): void;
    /**
     * @ignore
     */
    markDirtyGeometries(): void;
    /**
     * @ignore
     */
    markDirtyProjection(): void;
    protected _afterNew(): void;
    protected _handleChartDown(event: ISpritePointerEvent): void;
    /**
     * Converts screen coordinates (X and Y) within chart to latitude and
     * longitude.
     *
     * @param  point  Screen coordinates
     * @return        Geographical coordinates
     */
    invert(point: IPoint): IGeoPoint;
    /**
     * Converts latitude/longitude to screen coordinates (X and Y).
     *
     * @param  point  Geographical coordinates
     * @param  rotationX  X rotation of a map if different from current
     * @param  rotationY  Y rotation of a map if different from current
     *
     * @return Screen coordinates
     */
    convert(point: IGeoPoint, rotationX?: number, rotationY?: number): IPoint;
    protected _handleChartUp(_event: ISpritePointerEvent): void;
    protected _handlePinch(): void;
    protected _handleChartMove(event: ISpritePointerEvent): void;
    protected _handleWheelRotateY(delta: number, duration: number, easing: (t: Time) => Time): void;
    protected _handleWheelRotateX(delta: number, duration: number, easing: (t: Time) => Time): void;
    protected _handleWheelZoom(delta: number, point: IPoint): void;
    /**
     * Zoom the map to geographical bounds.
     *
     * @param  geoBounds  Bounds
     * @param  duration   Animation duration in milliseconds
     * @param  rotationX  X rotation of a map at the end of zoom
     * @param  rotationY  Y rotation of a map at the end of zoom
     */
    zoomToGeoBounds(geoBounds: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    }, duration?: number, rotationX?: number, rotationY?: number): Animation<this["_settings"]["zoomLevel"]> | undefined;
    /**
     * Zooms the map to specific screen point.
     *
     * @param  point    Point
     * @param  level    Zoom level
     * @param  center   Center the map
     * @param  duration Duration of the animation in milliseconds
     */
    zoomToPoint(point: IPoint, level: number, center?: boolean, duration?: number): Animation<this["_settings"]["zoomLevel"]> | undefined;
    /**
     * Zooms the map to specific geographical point.
     *
     * @param  geoPoint  Point
     * @param  level     Zoom level
     * @param  center    Center the map
     * @param  duration  Duration of the animation in milliseconds
     * @param  rotationX  X rotation of a map at the end of zoom
     * @param  rotationY  Y rotation of a map at the end of zoom
     *
     */
    zoomToGeoPoint(geoPoint: IGeoPoint, level: number, center?: boolean, duration?: number, rotationX?: number, rotationY?: number): Animation<this["_settings"]["zoomLevel"]> | undefined;
    rotate(rotationX?: number, rotationY?: number, duration?: number): void;
    /**
     * Zooms the map in.
     */
    zoomIn(): Animation<this["_settings"]["zoomLevel"]> | undefined;
    /**
     * Zooms the map out.
     */
    zoomOut(): Animation<this["_settings"]["zoomLevel"]> | undefined;
    _clearDirty(): void;
    /**
     * Returns area of a mapPolygon in square pixels.
     */
    getArea(dataItem: DataItem<IMapPolygonSeriesDataItem>): number;
}
//# sourceMappingURL=MapChart.d.ts.map
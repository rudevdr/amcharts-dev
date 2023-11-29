import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../core/util/Entity";
export interface IAnnotatorSettings extends IEntitySettings {
    /**
     * Layer number to use for annotations.
     *
     * @default 1000
     */
    layer?: number;
    /**
     * Raw annotation info saved by MarkerJS.
     */
    markerState?: any;
}
export interface IAnnotatorPrivate extends IEntityPrivate {
}
export interface IAnnotatorEvents extends IEntityEvents {
}
/**
 * A plugin that can be used to annotate charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/annotator/} for more info
 */
export declare class Annotator extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IAnnotatorSettings;
    _privateSettings: IAnnotatorPrivate;
    _events: IAnnotatorEvents;
    private _container?;
    private _picture?;
    private _markerArea?;
    private _skipRender?;
    protected _afterNew(): void;
    _beforeChanged(): void;
    /**
     * Triggers annotation mode on the chart. This will display UI toolbars and
     * disable all interactions on the chart itself.
     */
    open(): Promise<void>;
    _renderState(): Promise<void>;
    /**
     * Exists from annotation mode. All annotations remain visible on the chart.
     */
    close(): Promise<void>;
    /**
     * Exits from annotation mode. Any changes made during last session of the
     * annotation editing are cancelled.
     */
    cancel(): Promise<void>;
    /**
     * All annotations are removed.
     */
    clear(): void;
    toggle(): Promise<void>;
    dispose(): void;
    private _maybeInit;
    /**
     * @ignore
     */
    private _getMarkerJS;
    /**
     * An instance of MarkerJS's [[MarkerArea]].
     *
     * @see {@link https://markerjs.com/docs/getting-started} for more info
     * @return MarkerArea
     */
    getMarkerArea(): Promise<any>;
}
//# sourceMappingURL=Annotator.d.ts.map
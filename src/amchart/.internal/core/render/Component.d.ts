import { Settings } from "../util/Entity";
import { Container, IContainerSettings, IContainerPrivate, IContainerEvents } from "./Container";
import { ListData } from "../util/Data";
import type * as $ease from "../util/Ease";
import type { Bullet } from "./Bullet";
/**
 * A base element that holds data bit (data item) for any [[Component]].
 */
export declare class DataItem<P extends IComponentDataItem> extends Settings {
    _settings: P;
    /**
     * A data item's owener [[Component]].
     */
    component: Component;
    /**
     * A reference to actual item in source data this item is based on.
     */
    dataContext: unknown;
    /**
     * @todo requires description
     */
    bullets: Array<Bullet> | undefined;
    /**
     * A set of "open" values.
     */
    open: {
        [index: string]: any;
    } | undefined;
    /**
     * A set of "close" values.
     */
    close: {
        [index: string]: any;
    } | undefined;
    constructor(component: Component, dataContext: unknown, settings: P);
    /**
     * @ignore
     */
    markDirty(): void;
    _startAnimation(): void;
    protected _animationTime(): number | null;
    protected _dispose(): void;
    /**
     * Shows a data item that's currently hidden.
     */
    show(duration?: number): void;
    /**
     * Hides a data item that's currently visible.
     */
    hide(duration?: number): void;
    isHidden(): boolean;
}
export interface IComponentDataItem {
    visible?: boolean;
}
export interface IComponentSettings extends IContainerSettings {
    /**
     * A duration of the animation from one setting value to another, in
     * milliseconds.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Animating_data_values} for more info
     */
    interpolationDuration?: number;
    /**
     * Easing function to use for cross setting value animations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     */
    interpolationEasing?: $ease.Easing;
}
export interface IComponentPrivate extends IContainerPrivate {
}
export interface IComponentEvents extends IContainerEvents {
    datavalidated: {};
}
/**
 * A base class for elements that make use of data.
 */
export declare abstract class Component extends Container {
    static className: string;
    static classNames: Array<string>;
    _settings: IComponentSettings;
    _privateSettings: IComponentPrivate;
    _dataItemSettings: IComponentDataItem;
    _events: IComponentEvents;
    protected _data: ListData<unknown>;
    protected _dataItems: Array<DataItem<this["_dataItemSettings"]>>;
    _mainDataItems: DataItem<this["_dataItemSettings"]>[];
    protected valueFields: Array<string>;
    protected fields: Array<string>;
    protected _valueFields: Array<string>;
    protected _valueFieldsF: {
        [index: string]: {
            fieldKey: string;
            workingKey: string;
        };
    };
    protected _fields: Array<string>;
    protected _fieldsF: {
        [index: string]: string;
    };
    _valuesDirty: boolean;
    protected _dataChanged: boolean;
    protected _dataGrouped: boolean;
    /**
     * Indicates if the component has already been initialized.
     */
    inited: boolean;
    /**
     * Component's data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/data/} for more info
     */
    set data(data: ListData<unknown>);
    /**
     * @return  Data
     */
    get data(): ListData<unknown>;
    protected _dispose(): void;
    protected _onDataClear(): void;
    protected _afterNew(): void;
    protected _updateFields(): void;
    /**
     * A list of component's data items.
     *
     * @return  Data items
     */
    get dataItems(): Array<DataItem<this["_dataItemSettings"]>>;
    protected processDataItem(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    _makeDataItem(data: unknown): this["_dataItemSettings"];
    /**
     * @ignore
     */
    makeDataItem(data: this["_dataItemSettings"]): DataItem<this["_dataItemSettings"]>;
    /**
     * @ignore
     */
    pushDataItem(data: this["_dataItemSettings"]): DataItem<this["_dataItemSettings"]>;
    /**
     * @ignore
     */
    disposeDataItem(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Shows component's data item.
     *
     * @param   dataItem   Data item
     * @param   _duration  Animation duration in milliseconds
     * @return             Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, _duration?: number): Promise<void>;
    /**
     * Hides component's data item.
     *
     * @param   dataItem   Data item
     * @param   _duration  Animation duration in milliseconds
     * @return             Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, _duration?: number): Promise<void>;
    _clearDirty(): void;
    protected _afterDataChange(): void;
    _afterChanged(): void;
    /**
     * Forces a repaint of the element which relies on data.
     *
     * @since 5.0.21
     */
    markDirtyValues(_dataItem?: DataItem<this["_dataItemSettings"]>): void;
    _markDirtyGroup(): void;
    /**
     * @ignore
     */
    markDirtySize(): void;
}
//# sourceMappingURL=Component.d.ts.map
import type { Entity, Dirty } from "./Entity";
import type { State } from "./States";
import { EventDispatcher, Events } from "./EventDispatcher";
import { IDisposer } from "./Disposer";
export declare class TemplateState<E extends Entity> {
    _settings: Partial<E["_settings"]>;
    private _name;
    private _template;
    constructor(name: string, template: Template<E>, settings: Partial<E["_settings"]>);
    get<Key extends keyof this["_settings"]>(key: Key): this["_settings"][Key];
    get<Key extends keyof this["_settings"], F>(key: Key, fallback: F): NonNullable<this["_settings"][Key]> | F;
    set<Key extends keyof E["_settings"]>(key: Key, value: E["_settings"][Key]): void;
    remove<Key extends keyof this["_settings"]>(key: Key): void;
    setAll(settings: this["_settings"]): void;
    _apply(other: State<E>, seen: Dirty<E["_settings"]>): void;
}
export declare class TemplateStates<E extends Entity> {
    private _template;
    private _states;
    constructor(template: Template<E>);
    lookup(name: string): TemplateState<E> | undefined;
    create(name: string, settings: Partial<E["_settings"]>): TemplateState<E>;
    remove(name: string): void;
    _apply(entity: E, state: ApplyState<E>): void;
}
export declare class TemplateAdapters<E extends Entity> {
    private _callbacks;
    add<Key extends keyof E["_settings"]>(key: Key, callback: (value: E["_settings"][Key], target: E, key: Key) => E["_settings"][Key]): IDisposer;
    remove<Key extends keyof E["_settings"]>(key: Key): void;
    _apply(entity: E): IDisposer;
}
export interface ApplyState<E extends Entity> {
    settings: Dirty<E["_settings"]>;
    privateSettings: Dirty<E["_privateSettings"]>;
    states: {
        [name: string]: Dirty<E["_settings"]>;
    };
}
export declare class Template<E extends Entity> {
    _settings: Partial<E["_settings"]>;
    _privateSettings: E["_privateSettings"];
    _settingEvents: {
        [K in keyof this["_settings"]]?: Array<(<V extends this["_settings"][K]>(value: V) => void)>;
    };
    _privateSettingEvents: {
        [K in keyof this["_settings"]]?: Array<(<V extends this["_settings"][K]>(value: V) => void)>;
    };
    _entities: Array<E>;
    readonly states: TemplateStates<E>;
    readonly adapters: TemplateAdapters<E>;
    readonly events: EventDispatcher<Events<E, E["_events"]>>;
    setup: (<O extends E>(entity: O) => void) | undefined;
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @param   settings  Settings
     * @param   template  Template
     * @return            Instantiated object
     */
    static new<E extends Entity>(settings: E["_settings"]): Template<E>;
    /**
     * Array of all entities using this template.
     */
    get entities(): Array<E>;
    constructor(settings: E["_settings"], isReal: boolean);
    get<Key extends keyof this["_settings"]>(key: Key): this["_settings"][Key];
    get<Key extends keyof this["_settings"], F>(key: Key, fallback: F): NonNullable<this["_settings"][Key]> | F;
    setRaw<Key extends keyof this["_settings"]>(key: Key, value: this["_settings"][Key]): void;
    set<Key extends keyof this["_settings"]>(key: Key, value: this["_settings"][Key]): void;
    remove<Key extends keyof this["_settings"]>(key: Key): void;
    removeAll(): void;
    getPrivate<Key extends keyof this["_privateSettings"], F>(key: Key, fallback: F): NonNullable<this["_privateSettings"][Key]> | F;
    getPrivate<Key extends keyof this["_privateSettings"]>(key: Key): this["_privateSettings"][Key];
    setPrivateRaw<Key extends keyof this["_privateSettings"], Value extends this["_privateSettings"][Key]>(key: Key, value: Value): Value;
    setPrivate<Key extends keyof this["_privateSettings"], Value extends this["_privateSettings"][Key]>(key: Key, value: Value): Value;
    removePrivate<Key extends keyof this["_privateSettings"]>(key: Key): void;
    setAll(value: this["_settings"]): void;
    on<Key extends keyof this["_settings"]>(key: Key, callback: (value: this["_settings"][Key], target?: E, key?: Key) => void): IDisposer;
    onPrivate<Key extends keyof this["_privateSettings"]>(key: Key, callback: (value: this["_privateSettings"][Key], target?: E, key?: Key) => void): IDisposer;
    _apply(entity: E, state: ApplyState<E>): IDisposer;
    _setObjectTemplate(entity: E): void;
    _removeObjectTemplate(entity: E): void;
    _stateChanged(name: string): void;
}
//# sourceMappingURL=Template.d.ts.map
import type { ICounterRef } from "./Counter";
import { List } from "./List";
import type { DataProcessor } from "./DataProcessor";
/**
 * Defines interface for a [[List]] with a data processor.
 */
export interface IDataWithProcessor {
    /**
     * An optional processor for data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data} for more info
     */
    processor?: DataProcessor;
}
/**
 * A [[List]] that holds components data.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/} for more info
 */
export declare class ListData<T> extends List<T> implements ICounterRef, IDataWithProcessor {
    /**
     * @ignore
     */
    incrementRef(): void;
    /**
     * @ignore
     */
    decrementRef(): void;
    /**
     * An optional processor for data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data} for more info
     */
    processor?: DataProcessor;
    protected _onPush(newValue: T): void;
    protected _onInsertIndex(index: number, newValue: T): void;
    protected _onSetIndex(index: number, oldValue: T, newValue: T): void;
}
/**
 * @deprecated
 * @todo remove
 */
export declare class JsonData<T> implements ICounterRef, IDataWithProcessor {
    incrementRef(): void;
    decrementRef(): void;
    processor?: DataProcessor;
    protected _value: T;
    constructor(value: T);
}
//# sourceMappingURL=Data.d.ts.map
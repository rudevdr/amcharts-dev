import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "./Entity";
export interface IDataProcessorSettings extends IEntitySettings {
    /**
     * Date format used for parsing string-based dates.
     */
    dateFormat?: string;
    /**
     * A list of fields in data that need to be converted to tiemstamps.
     */
    dateFields?: string[];
    /**
     * A list of fields in data that need to be converted to numbers.
     */
    numericFields?: string[];
    /**
     * A list of fields in data that need to be converted to [[Color]] objects.
     */
    colorFields?: string[];
    /**
     * Replace empty values with this.
     */
    emptyAs?: any;
}
export interface IDataProcessorPrivate extends IEntityPrivate {
    /**
     * @ignore
     */
    deepFields?: string[];
}
export interface IDataProcessorEvents extends IEntityEvents {
}
/**
 * A tool that can process the data before it is being used in charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data} for more info
 * @important
 */
export declare class DataProcessor extends Entity {
    _settings: IDataProcessorSettings;
    _privateSettings: IDataProcessorPrivate;
    protected _checkDates: boolean;
    protected _checkNumbers: boolean;
    protected _checkColors: boolean;
    protected _checkEmpty: boolean;
    protected _checkDeep: boolean;
    protected _afterNew(): void;
    protected _checkFeatures(): void;
    protected _checkDeepFeatures(): void;
    /**
     * Processess entire array of data.
     *
     * NOTE: calling this will modify original array!
     */
    processMany(data: {
        [index: string]: any;
    }[]): void;
    /**
     * Processes a row (object) of data.
     *
     * NOTE: calling this will modify values of the original object!
     */
    processRow(row: {
        [index: string]: any;
    }, prefix?: string): void;
    protected _maybeToNumber(field: string, value: any): any;
    protected _maybeToDate(field: string, value: any): any;
    protected _maybeToEmpty(value: any): any;
    protected _maybeToColor(field: string, value: any): any;
}
//# sourceMappingURL=DataProcessor.d.ts.map
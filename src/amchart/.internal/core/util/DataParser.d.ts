export interface IJSONParserOptions {
    /**
     * Reverse the order of parsed data.
     */
    reverse?: boolean;
}
/**
 * Tool to parse JSON string into structured data.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Parsing} for more info
 * @important
 */
export declare class JSONParser {
    /**
     * Parses JSON string.
     *
     * @param   input    JSON
     * @param   options  Options
     * @return           Data
     */
    static parse(input: string, options?: IJSONParserOptions): any;
    protected static _applyDefaults(options?: IJSONParserOptions): IJSONParserOptions;
}
export interface ICSVParserOptions {
    /**
     * Delimiter used for columns.
     *
     * @default ","
     */
    delimiter?: string;
    /**
     * Reverse the order of parsed data.
     */
    reverse?: boolean;
    /**
     * Skip first X rows.
     *
     * @default 0
     */
    skipRows?: number;
    /**
     * Skip empty rows.
     *
     * @default true
     */
    skipEmpty?: boolean;
    /**
     * Use the first row to name the columns.
     *
     * @default false
     */
    useColumnNames?: boolean;
}
/**
 * Tool to parse JSON string into structured data.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Parsing} for more info
 * @important
 */
export declare class CSVParser {
    /**
     * Parses CSV string.
     *
     * @param   input    CSV
     * @param   options  Options
     * @return           Data
     */
    static parse(input: string, options?: ICSVParserOptions): any;
    /**
     * @ignore
     */
    static CSVToArray(data: string, delimiter: string): any[];
    protected static _applyDefaults(options?: ICSVParserOptions): ICSVParserOptions;
}
//# sourceMappingURL=DataParser.d.ts.map
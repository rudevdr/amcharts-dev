import type { ExportingMenu } from "./ExportingMenu";
import type { TimeUnit } from "../../core/util/Time";
import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../core/util/Entity";
import { Color } from "../../core/util/Color";
import { Root } from "../../core/Root";
export interface IFile {
    path: string;
    bytes: string;
}
export interface IFont {
    name: string;
    normal: IFile;
    bold?: IFile;
    italics?: IFile;
    bolditalics?: IFile;
}
export declare type ExportingTypes = "image" | "data" | "print";
export declare type ExportingFormats = "png" | "jpg" | "canvas" | "pdf" | "xlsx" | "csv" | "json" | "html" | "pdfdata" | "print";
export declare type ExportingImageFormats = "png" | "jpg";
export interface IExportingImageSource {
    /**
     * A root object of an extra chart to add in export.
     */
    source: Root;
    /**
     * Top margin in pixels.
     */
    marginTop?: number;
    /**
     * Right margin in pixels.
     */
    marginRight?: number;
    /**
     * Bottom margin in pixels.
     */
    marginBottom?: number;
    /**
     * Left margin in pixels.
     */
    marginLeft?: number;
    /**
     * Position to place extra image in releation to the main chart.
     *
     * @default "bottom"
     */
    position?: "left" | "right" | "top" | "bottom";
    /**
     * Crop extra image if it's larger than the main chart.
     */
    crop?: boolean;
}
export interface IExportingSettings extends IEntitySettings {
    /**
     * A reference to [[ExportingMenu]] object.
     */
    menu?: ExportingMenu;
    /**
     * Export will try to determine background color based on the DOM styles.
     *
     * You can use this setting to explicitly specify background color for
     * exported images.
     */
    backgroundColor?: Color;
    /**
     * Opacity of the exported image background.
     *
     * * 0 - fully transparent.
     * * 1 - fully opaque (default).
     *
     * NOTE: some image formats like JPEG do not support transparency.
     *
     * @since 5.2.34
     */
    backgroundOpacity?: number;
    /**
     * A string to prefix exported files with.
     *
     * @default "chart"
     */
    filePrefix?: string;
    /**
     * Chart title. Used for print, PDF and Excel exports.
     */
    title?: string;
    /**
     * Charset to use for export.
     *
     * @default "utf-8"
     */
    charset?: string;
    /**
     * Fields to include in data export.
     *
     * Key - field in data.
     * Value - column name.
     */
    dataFields?: {
        [index: string]: string;
    };
    /**
     * Specifies the order of fields to export in data.
     */
    dataFieldsOrder?: string[];
    /**
     * Fields in data that are numeric.
     */
    numericFields?: string[];
    /**
     * Use this number format on numeric values.
     */
    numberFormat?: string | Intl.NumberFormatOptions;
    /**
     * Fields in data that have date/time value.
     */
    dateFields?: string[];
    /**
     * Use this date format on date values.
     */
    dateFormat?: string | Intl.DateTimeFormatOptions;
    /**
     * Fields in data that need to be formatted as "duration" as per `durationFormat`.
     *
     * @since 5.0.16
     */
    durationFields?: string[];
    /**
     * Format to use when formatting values in `durationFields`.
     *
     * If not set, will use `durationFormat` as set in [[DurationFormatter]] of
     * the root element.
     *
     * @since 5.0.16
     */
    durationFormat?: string;
    /**
     * Time unit to assume duration values are in.
     *
     * If not set, will use `baseUnit` as set in [[DurationFormatter]] of
     * the root element.
     *
     * @since 5.0.16
     */
    durationUnit?: TimeUnit;
    /**
     * Include these images or other charts in image exports.
     */
    extraImages?: Array<Root | IExportingImageSource>;
    /**
     * Data to export.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/#Exporting_data} for more info
     */
    dataSource?: any;
    /**
     * PNG format options.
     */
    pngOptions?: IExportingImageOptions;
    /**
     * JPEG format options.
     */
    jpgOptions?: IExportingImageOptions;
    /**
     * Canvas format options.
     */
    canvasOptions?: IExportingImageOptions;
    /**
     * PDF format options.
     */
    pdfOptions?: IExportingPDFOptions;
    /**
     * PDF with data table format options.
     */
    pdfdataOptions?: IExportingDataOptions;
    /**
     * XSLX format options.
     */
    xlsxOptions?: IExportingXLSXOptions;
    /**
     * CSV format options.
     */
    csvOptions?: IExportingCSVOptions;
    /**
     * JSON format options.
     */
    jsonOptions?: IExportingJSONOptions;
    /**
     * HTML format options.
     */
    htmlOptions?: IExportingHTMLOptions;
    /**
     * Print options.
     */
    printOptions?: IExportingPrintOptions;
}
export interface IExportingPrivate extends IEntityPrivate {
}
export interface IExportEvent {
    /**
     * Format.
     */
    format: ExportingFormats;
    /**
     * Format options.
     */
    options: IExportingFormatOptions;
}
export interface IExportingEvents extends IEntityEvents {
    /**
     * Invoked when export starts.
     */
    exportstarted: IExportEvent;
    /**
     * Invoked when export finishes.
     */
    exportfinished: IExportEvent;
    /**
     * Invoked when download of the export starts.
     */
    downloadstarted: IExportEvent & {
        fileName: string;
    };
    /**
     * Invoked when print starts.
     */
    printstarted: IExportEvent;
    /**
     * Invoked when data finishes pre-processing for export.
     */
    dataprocessed: IExportEvent & {
        data: any;
    };
    /**
     * Invoked when XLSX export finishes preparing a workbook.
     *
     * At this point it can still be modified for export.
     */
    workbookready: IExportEvent & {
        workbook: any;
        workbookOptions: any;
        xlsx: any;
    };
    /**
     * Invoked when PDF export finishes preparing a document.
     *
     * At this point it can still be modified for export.
     */
    pdfdocready: IExportEvent & {
        doc: any;
    };
}
export interface IExportingFormatOptions {
    /**
     * If set to `true`, this format will not appear in [[ExportMenu]].
     */
    disabled?: boolean;
}
export interface IExportingImageOptions extends IExportingFormatOptions {
    /**
     * Quality of the exported image: 0 to 1.
     */
    quality?: number;
    /**
     * Export images with hardware resolution (`false`), or the way they appear
     * on screen (`true`).
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-images/#Pixel_ratio} for more info
     * @default false
     */
    maintainPixelRatio?: boolean;
    /**
     * Minimal width of exported image, in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-images/#Sizing_exported_image} for more info
     */
    minWidth?: number;
    /**
     * Maximal width of exported image, in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-images/#Sizing_exported_image} for more info
     */
    maxWidth?: number;
    /**
     * Minimal height of exported image, in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-images/#Sizing_exported_image} for more info
     */
    minHeight?: number;
    /**
     * Maximal height of exported image, in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-images/#Sizing_exported_image} for more info
     */
    maxHeight?: number;
}
export interface IExportingPrintOptions extends IExportingImageOptions {
    /**
     * A delay in milliseconds to wait before initiating print.
     *
     * This delay is necessary to ensure DOM is prepared and repainted before
     * print dialog kicks in.
     *
     * @default 500
     */
    delay?: number;
    /**
     * Method to use for printing.
     *
     * If one fails for your particular setup, try the other.
     *
     * "css" - inserts dynamic CSS that hides everything, except the image being printed.
     * "iframe" - creates a dynamic `<iframe>` with the image, then prints it.
     *
     * @default "iframe"
     */
    printMethod?: "css" | "iframe";
    /**
     * Image format to use for printing.
     *
     * @default "png"
     */
    imageFormat?: "png" | "jpg";
}
/**
 * Available PDF page sizes.
 */
export declare type pageSizes = "4A0" | "2A0" | "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "A10" | "B0" | "B1" | "B2" | "B3" | "B4" | "B5" | "B6" | "B7" | "B8" | "B9" | "B10" | "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C9" | "C10" | "RA0" | "RA1" | "RA2" | "RA3" | "RA4" | "SRA0" | "SRA1" | "SRA2" | "SRA3" | "SRA4" | "EXECUTIVE" | "FOLIO" | "LEGAL" | "LETTER" | "TABLOID";
export interface IExportingPDFOptions extends IExportingImageOptions {
    /**
     * Include data into PDF
     */
    includeData?: boolean;
    /**
     * An image format to use for embedded images in PDF.
     *
     * See `imageFormats` in [[Export_module]].
     */
    imageFormat?: "png" | "jpg";
    /**
     * Font size to use for all texts.
     */
    fontSize?: number;
    /**
     * Alignment of the chart image in PDF.
     *
     * Supported options: `"left"` (default), `"center"`, `"right"`.
     *
     * @default left
     */
    align?: "left" | "center" | "middle";
    /**
     * Whether to add a URL of the web page the chart has been exported from.
     *
     * @default true
     */
    addURL?: boolean;
    /**
     * Page size of the exported PDF.
     */
    pageSize?: pageSizes;
    /**
     * Page orientation.
     */
    pageOrientation?: "landscape" | "portrait";
    /**
     * Page margins.
     *
     * Can be one of the following:
     *
     * A single number, in which case it will act as margin setting
     * for all four edges of the page.
     *
     * An array of two numbers `[ horizontal, vertical ]`.
     *
     * An array of four numbers `[ left, top, right, bottom ]`.
     */
    pageMargins?: number | number[];
    /**
     * Font which should be used for the export.
     *
     * Default font used for PDF includes only Latin-based and Cyrilic
     * characters. If you are exporting text in other languages, you might need
     * to use some other export font.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-pdf/#Fonts} for more info
     */
    font?: IFont;
    /**
     * Additional optional fonts which can be used on individual elements.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/exporting-pdf/#Fonts} for more info
     */
    extraFonts?: Array<IFont>;
}
export interface IExportingDataOptions extends IExportingFormatOptions {
    /**
     * Replace empty values with this string.
     */
    emptyAs?: string;
    /**
     * Use timestamps instead of formatted dates.
     *
     * @default false
     */
    useTimestamps?: boolean;
    /**
     * Use client's locale when formatting dates.
     *
     * @default false
     */
    useLocale?: boolean;
    /**
     * If set to `true` will pivot the able so that columns are horizontal.
     */
    pivot?: boolean;
    /**
     * Will add a line with column names in CSV/HTML/PDF tables.
     */
    addColumnNames?: boolean;
}
export interface IExportingJSONOptions extends IExportingDataOptions {
    /**
     * If set to a number, each line will be indented by X spaces, maintaining
     * hierarchy.
     *
     * If set to a string, will use that string to indent.
     *
     * @default 2
     */
    indent?: string | number;
    /**
     * If set to `true` and `dataFields` are set to `true`, will rename keys in
     * data.
     *
     * @default true
     */
    renameFields?: boolean;
}
export interface IExportingCSVOptions extends IExportingDataOptions {
    /**
     * Column separator.
     *
     * @default ","
     */
    separator?: string;
    /**
     * Force all values to be included in quotes, including numeric.
     *
     * @default false
     */
    forceQuotes?: boolean;
    /**
     * Reverse order of the records in data.
     *
     * @default false
     */
    reverse?: boolean;
    /**
     * Add BOM character to output file, so that it can be used with UTF-8
     * characters properly in Excel.
     *
     * @default false
     * @since 5.1.0
     */
    addBOM?: boolean;
}
export interface IExportingHTMLOptions extends IExportingDataOptions {
    /**
     * A `class` attribute for `<table>` tag.
     */
    tableClass?: string;
    /**
     * A `class` attribute for `<tr>` tags.
     */
    rowClass?: string;
    /**
     * A `class` attribute for `<th>` tags.
     */
    headerClass?: string;
    /**
     * A `class` attribute for `<td>` tags.
     */
    cellClass?: string;
}
export interface IExportingXLSXOptions extends IExportingDataOptions {
}
/**
 * A plugin that can be used to export chart snapshots and data.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/exporting/} for more info
 */
export declare class Exporting extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IExportingSettings;
    _privateSettings: IExportingPrivate;
    _events: IExportingEvents;
    protected _afterNew(): void;
    _beforeChanged(): void;
    protected _getFormatOptions(format: ExportingFormats, options?: IExportingFormatOptions): IExportingFormatOptions;
    /**
     * Triggers a download of the chart/data in specific format.
     *
     * @param  format         Format
     * @param  customOptions  Format options
     */
    download(format: ExportingFormats, customOptions?: IExportingFormatOptions): Promise<void>;
    /**
     * Triggers print of the chart.
     *
     * @param  customOptions  Print options
     */
    print(customOptions?: IExportingPrintOptions): Promise<void>;
    /**
     * Returns data uri of the chart/data in specific format.
     *
     * @param          format  Format
     * @param   customOptions  Format options
     * @return                 Promise
     */
    export(format: ExportingFormats, customOptions?: IExportingFormatOptions): Promise<string>;
    /**
     * ==========================================================================
     * Images
     * ==========================================================================
     */
    /**
     * Returns chart image as a data:uri.
     *
     * @param   format         Image format
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportImage(format: ExportingImageFormats, customOptions?: IExportingImageOptions): Promise<string>;
    /**
     * Returns canvas data.
     *
     * @param   customOptions  Image options
     * @return                 Promise
     */
    exportCanvas(customOptions?: IExportingImageOptions): Promise<string>;
    /**
     * Returns a `<canvas>` element with snapshot of the chart.
     *
     * @param   options  Image options
     * @return           Promise
     */
    getCanvas(options: IExportingImageOptions): Promise<HTMLCanvasElement>;
    /**
     * ==========================================================================
     * JSON
     * ==========================================================================
     */
    /**
     * Returns a data:uri representation of a JSON file with chart data.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportJSON(customOptions?: IExportingJSONOptions): Promise<string>;
    /**
     * Returns data in JSON format.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    getJSON(customOptions?: IExportingJSONOptions): Promise<string>;
    /**
     * ==========================================================================
     * CSV
     * ==========================================================================
     */
    /**
     * Returns a data:uri representation of a CSV file with chart data.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportCSV(customOptions?: IExportingCSVOptions): Promise<string>;
    /**
     * Returns a CSV with export data.
     *
     * @param   customOptions  CSV options
     * @return                 Promise
     */
    getCSV(customOptions?: IExportingCSVOptions): Promise<string>;
    /**
     * @ignore
     */
    getCSVRow(row: any, options: IExportingCSVOptions, dataFields: any, asIs?: boolean): string;
    /**
     * ==========================================================================
     * HTML
     * ==========================================================================
     */
    /**
     * Returns a data:uri representation of an HTML file with chart data.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportHTML(customOptions?: IExportingHTMLOptions): Promise<string>;
    /**
     * Returns an HTML with a table with export data.
     *
     * @param   customOptions  HTML options
     * @return                 Promise
     */
    getHTML(customOptions?: IExportingHTMLOptions): Promise<string>;
    /**
     * @ignore
     */
    getHTMLRow(row: any, options: IExportingHTMLOptions, dataFields: any, asIs?: boolean, headerRow?: boolean): string;
    /**
     * ==========================================================================
     * XLSX
     * ==========================================================================
     */
    /**
     * Returns a data:uri representation of an XLSX file with chart data.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportXLSX(customOptions?: IExportingXLSXOptions): Promise<string>;
    /**
     * Returns a data:uri of XLSX data.
     *
     * @param  customOptions  Format options
     * @return                Promise
     */
    getXLSX(customOptions?: IExportingXLSXOptions): Promise<string>;
    private _normalizeExcelSheetName;
    /**
     * @ignore
     */
    getXLSXRow(row: any, options: IExportingXLSXOptions, dataFields: any, asIs?: boolean): any[];
    /**
     * @ignore
     */
    private _xlsx;
    /**
     * @ignore
     */
    getXLSXLib(): Promise<any>;
    /**
     * ==========================================================================
     * PDF
     * ==========================================================================
     */
    /**
     * Returns a data:uri representation of a PDF file with chart image.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportPDF(customOptions?: IExportingPDFOptions): Promise<string>;
    /**
     * Returns a data:uri representation of a PDF file with chart data.
     *
     * @param   customOptions  Format options
     * @return                 Promise
     */
    exportPDFData(customOptions?: IExportingDataOptions): Promise<string>;
    /**
     * Returns Base64-encoded binary data for a PDF file.
     * @param   customOptions  PDF options
     * @param   includeImage   Include chart snapshot
     * @param   includeData    Include data
     * @return                 Promise
     */
    getPDF(customOptions?: IExportingPDFOptions, includeImage?: boolean, includeData?: boolean): Promise<string>;
    /**
     * @ignore
     */
    getPDFData(customOptions?: IExportingDataOptions): Promise<any>;
    /**
     * @ignore
     */
    getPDFDataRow(row: any, options: IExportingDataOptions, dataFields?: any, asIs?: boolean): Array<string>;
    /**
     * Returns pdfmake instance.
     *
     * @ignore
     * @return Instance of pdfmake
     */
    getPdfmake(): Promise<any>;
    /**
     * @ignore
     */
    getPageSizeFit(pageSize: pageSizes, margins: number | number[], extraMargin?: number, orientation?: "landscape" | "portrait"): number[];
    /**
     * ==========================================================================
     * Data
     * ==========================================================================
     */
    /**
        * Returns `true` if `dataSource` is set, and the contents are proper
        * data (array).
        *
        * @return Has data?
        */
    hasData(): boolean;
    /**
     * Returns processed data according to format options.
     *
     * @param   format         Format
     * @param   customOptions  Format options
     * @param   renameFields   Should fields be renamed?
     * @return                 Processed data
     */
    getData(format: ExportingFormats, customOptions?: IExportingDataOptions, renameFields?: boolean): any;
    /**
     * @ignore
     */
    getDataFields(data: any): {
        [index: string]: string;
    };
    /**
     * @ignore
     */
    convertEmptyValue(_field: string, value: any, options: IExportingDataOptions): any;
    /**
     * @ignore
     */
    convertToSpecialFormat(field: any, value: any, options: IExportingDataOptions, keepOriginal?: boolean): any;
    /**
     * @ignore
     */
    isDateField(field: string): boolean;
    /**
     * @ignore
     */
    isNumericField(field: string): boolean;
    /**
     * @ignore
     */
    isDurationField(field: string): boolean;
    /**
     * @ignore
     */
    getContentType(type: ExportingFormats): string;
    protected getDisposableCanvas(): HTMLCanvasElement;
    protected disposeCanvas(canvas: HTMLCanvasElement): void;
    /**
     * @ignore
     */
    findBackgroundColor(element: Element): Color;
    /**
     * Triggers download of the file.
     *
     * @param   uri       data:uri with file content
     * @param   fileName  File name
     * @param   addBOM    Should download include byte order mark?
     * @return            Promise
     */
    streamFile(uri: string, fileName: string, addBOM?: boolean): boolean;
    /**
     * @ignore
     */
    downloadSupport(): boolean;
    /**
     * @ignore
     */
    linkDownloadSupport(): boolean;
    /**
     * @ignore
     */
    blobDownloadSupport(): boolean;
    /**
     * ==========================================================================
     * Print
     * ==========================================================================
     */
    /**
     * Initiates print of the chart.
     *
     * @param   data     data:uri for the image
     * @param   options  Options
     * @param   title    Optional title to use (uses window's title by default)
     * @return           Promise
     */
    initiatePrint(data: string, customOptions?: IExportingPrintOptions, title?: string): void;
    protected _printViaCSS(data: string, customOptions?: IExportingPrintOptions, title?: string): void;
    protected _printViaIframe(data: string, customOptions?: IExportingPrintOptions, title?: string): void;
    /**
     * Returns a list of formats that can be exported in current browser.
     *
     * @return Formats
     */
    supportedFormats(): ExportingFormats[];
    /**
     * Returns a list of supported export types: image or print.
     *
     * @return Supported types
     */
    supportedExportTypes(): ExportingTypes[];
}
//# sourceMappingURL=Exporting.d.ts.map
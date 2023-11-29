import type { DataItem } from "../../core/render/Component";
import type { ColorSet } from "../../core/util/ColorSet";
import type { Percent } from "../../core/util/Percent";
import type { IPoint } from "../../core/util/IPoint";
import type { IDisposer } from "../../core/util/Disposer";
import type { Time } from "../../core/util/Animation";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate } from "../../core/render/Series";
import { Label } from "../../core/render/Label";
import { Container } from "../../core/render/Container";
import { ListTemplate } from "../../core/util/List";
import { Color } from "../../core/util/Color";
import type { IBounds } from "../../core/util/IBounds";
export interface IWordCloudDataItem extends ISeriesDataItem {
    /**
     * Category.
     */
    category: string;
    /**
     * Label.
     */
    label: Label;
    /**
     * Label.
     */
    ghostLabel: Label;
    /**
     * Fill color used for the slice and related elements, e.g. legend marker.
     */
    fill: Color;
    /**
     * @ignore
     */
    set: number;
    /**
     * @ignore
     */
    angle: number;
    /**
     * @ignore
     */
    fontSize: number;
}
export interface IWordCloudSettings extends ISeriesSettings {
    /**
     * Duration of word animation when chart resizes.
     */
    animationDuration?: number;
    /**
     * An easing function to use for word animations.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     * @default am5.ease.out($ease.cubic)
     */
    animationEasing?: (t: Time) => Time;
    /**
     * @default false
     */
    autoFit?: boolean;
    /**
     * @readonly
     */
    progress?: number;
    /**
     * A [[ColorSet]] to use when asigning colors for slices.
     */
    colors?: ColorSet;
    /**
     * A field in data that holds category names.
     */
    categoryField?: string;
    /**
     * A field that holds color for label fill.
     */
    fillField?: string;
    /**
     * Source text from which words are extracted.
     */
    text?: string;
    /**
     * Absolute or relative font size for the smallest words.
     */
    minFontSize?: number | Percent;
    /**
     * Absolute or relative font size for the biggest words.
     */
    maxFontSize?: number | Percent;
    /**
     * Minimum occurances for a word to be included into cloud.
     */
    minValue?: number;
    /**
     * Maximum number of words to show.
     */
    maxCount?: number;
    /**
     * Array of words  exclude from cloud.
     */
    excludeWords?: Array<string>;
    /**
     * Randomness of word placement (0-1).
     */
    randomness?: number;
    /**
     * Minimum number of characters for a word to be included in the cloud.
     */
    minWordLength?: number;
    /**
     * An array of possible rotation angles for words.
     */
    angles?: number[];
    /**
     * Step for next word placement.
     */
    step?: number;
}
export interface IWordCloudPrivate extends ISeriesPrivate {
    /**
     * Indicates whether size of the font was adjusted for better fit.
     */
    adjustedFontSize: number;
}
/**
 * Creates a [[WordlCloud]] series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/word-cloud/} for more info
 * @important
 */
export declare class WordCloud extends Series {
    static className: string;
    static classNames: Array<string>;
    _settings: IWordCloudSettings;
    _privateSettings: IWordCloudPrivate;
    _dataItemSettings: IWordCloudDataItem;
    protected _currentIndex: number;
    protected _timeoutDP?: IDisposer;
    protected _ghostContainer: Container;
    protected _pointSets: Array<Array<IPoint>>;
    protected _sets: number;
    protected _process: boolean;
    protected _buffer: Array<number>;
    protected _boundsToAdd?: IBounds;
    protected _afterNew(): void;
    /**
     * A [[ListTemplate]] of all labels in series.
     *
     * `labels.template` can also be used to configure labels.
     */
    readonly labels: ListTemplate<Label>;
    /**
     * @ignore
     */
    makeLabel(dataItem: DataItem<this["_dataItemSettings"]>): Label;
    protected _makeLabels(): ListTemplate<Label>;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _prepareChildren(): void;
    _updateChildren(): void;
    protected _processItem(): void;
    /**
* @ignore
*/
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
* Extracts words and number of their appearances from a text.
*
* @ignore
* @param  input  Source text
*/
    protected _getWords(input?: string): Array<{
        category: string;
        value: number;
    }>;
    /**
* Checks if word is capitalized (starts with an uppercase) or not.
*
* @ignore
* @param   word  Word
* @return        Capitalized?
*/
    isCapitalized(word: string): boolean;
    protected _hasColor(x: number, y: number, w: number, h: number, cols: number): boolean;
}
//# sourceMappingURL=WordCloud.d.ts.map
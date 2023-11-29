import type { ITextStyle } from "../render/backend/Renderer";
/**
 * Defines an interface for an object that holds a chunk of text.
 */
export interface ITextChunk {
    /**
     * Type of the chunk.
     */
    "type": "value" | "text" | "format" | "image";
    /**
     * Text.
     */
    "text": string;
}
export declare class TextFormatter {
    static prefix: string;
    /**
     * Replaces brackets with temporary placeholders.
     *
     * @ignore Exclude from docs
     * @param text  Input text
     * @return Escaped text
     */
    static escape(text: string): string;
    /**
     * Replaces placeholders back to brackets.
     *
     * @ignore Exclude from docs
     * @param text  Escaped text
     * @return Unescaped text
     */
    static unescape(text: string): string;
    /**
     * Cleans up the text text for leftover double square brackets.
     *
     * @ignore Exclude from docs
     * @param text  Input text
     * @return Cleaned up text
     */
    static cleanUp(text: string): string;
    /**
     * Splits string into chunks. (style blocks, quoted blocks, regular blocks)
     *
     * If the second parameter `quotedBlocks` is set to `true` this method will
     * also single out text blocks enclosed within single quotes that no
     * formatting should be applied to, and they should be displayed as is.
     *
     * Default for the above is `false`, so that you can use single quote in text
     * without escaping it.
     *
     * If enabled, single quotes can be escaped by doubling it - adding two
     * single quotes, which will be replaced by a one single quote in the final
     * output.
     *
     * @ignore Exclude from docs
     * @param text          Text to chunk
     * @param quotedBlocks  Use quoted blocks
     * @param noFormatting  Formatting blocks will be treated as regular text
     * @return Array of string chunks
     */
    static chunk(text: string, quotedBlocks?: boolean, noFormatting?: boolean): ITextChunk[];
    /**
     * Checks if supplied format contains image information and should be
     * formatted as such.
     * I.e.: `[img: myImage.png]`
     *
     * @ignore
     * @param  text  Format
     * @return true if it is an image
     */
    static isImage(text: string): boolean;
    static getTextStyle(style: string): ITextStyle;
}
//# sourceMappingURL=TextFormatter.d.ts.map
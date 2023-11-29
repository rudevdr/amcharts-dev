export interface StockIcon {
    viewbox: string;
    path: string;
    style?: string;
}
/**
 * A collection of icons used in [[StockChart]].
 */
export declare class StockIcons {
    static icons: {
        [index: string]: StockIcon;
    };
    static getIcon(id: string): SVGElement;
    static _getSVG(icon: any): SVGElement;
}
//# sourceMappingURL=StockIcons.d.ts.map
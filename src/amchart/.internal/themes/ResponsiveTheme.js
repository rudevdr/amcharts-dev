import { Theme } from "../core/Theme";
import { MultiDisposer } from "../core/util/Disposer";
import { p100, percent } from "../core/util/Percent";
import * as $array from "../core/util/Array";
/**
 * A configurable theme that dynamically adapts chart settings for best fit
 * in available space.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/responsive/} for more info
 */
export class ResponsiveTheme extends Theme {
    constructor(root, isReal) {
        super(root, isReal);
        Object.defineProperty(this, "_dp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Currently added rules.
         */
        Object.defineProperty(this, "responsiveRules", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this._dp = new MultiDisposer([
            this._root._rootContainer.onPrivate("width", (_width) => {
                if (this._isUsed()) {
                    this._maybeApplyRules();
                }
            }),
            this._root._rootContainer.onPrivate("height", (_height) => {
                if (this._isUsed()) {
                    this._maybeApplyRules();
                }
            })
        ]);
    }
    // Breakpoint functions (for use in `relevant` clause of the responsive rules)
    static widthXXS(width, _height) {
        return width <= ResponsiveTheme.XXS;
    }
    static widthXS(width, _height) {
        return width <= ResponsiveTheme.XS;
    }
    static widthS(width, _height) {
        return width <= ResponsiveTheme.S;
    }
    static widthM(width, _height) {
        return width <= ResponsiveTheme.M;
    }
    static widthL(width, _height) {
        return width <= ResponsiveTheme.L;
    }
    static widthXL(width, _height) {
        return width <= ResponsiveTheme.XL;
    }
    static widthXXL(width, _height) {
        return width <= ResponsiveTheme.XXL;
    }
    static heightXXS(_width, height) {
        return height <= ResponsiveTheme.XXS;
    }
    static heightXS(_width, height) {
        return height <= ResponsiveTheme.XS;
    }
    static heightS(_width, height) {
        return height <= ResponsiveTheme.S;
    }
    static heightM(_width, height) {
        return height <= ResponsiveTheme.M;
    }
    static heightL(_width, height) {
        return height <= ResponsiveTheme.L;
    }
    static heightXL(_width, height) {
        return height <= ResponsiveTheme.XL;
    }
    static heightXXL(_width, height) {
        return height <= ResponsiveTheme.XXL;
    }
    static isXXS(width, height) {
        return (width <= ResponsiveTheme.XXS) && (height <= ResponsiveTheme.XXS);
    }
    static isXS(width, height) {
        return (width <= ResponsiveTheme.XS) && (height <= ResponsiveTheme.XS);
    }
    static isS(width, height) {
        return (width <= ResponsiveTheme.S) && (height <= ResponsiveTheme.S);
    }
    static isM(width, height) {
        return (width <= ResponsiveTheme.M) && (height <= ResponsiveTheme.M);
    }
    static isL(width, height) {
        return (width <= ResponsiveTheme.L) && (height <= ResponsiveTheme.L);
    }
    static isXL(width, height) {
        return (width <= ResponsiveTheme.XL) && (height <= ResponsiveTheme.XL);
    }
    static isXXL(width, height) {
        return (width <= ResponsiveTheme.XXL) && (height <= ResponsiveTheme.XXL);
    }
    static maybeXXS(width, height) {
        return (width <= ResponsiveTheme.XXS) || (height <= ResponsiveTheme.XXS);
    }
    static maybeXS(width, height) {
        return (width <= ResponsiveTheme.XS) || (height <= ResponsiveTheme.XS);
    }
    static maybeS(width, height) {
        return (width <= ResponsiveTheme.S) || (height <= ResponsiveTheme.S);
    }
    static maybeM(width, height) {
        return (width <= ResponsiveTheme.M) || (height <= ResponsiveTheme.M);
    }
    static maybeL(width, height) {
        return (width <= ResponsiveTheme.L) || (height <= ResponsiveTheme.L);
    }
    static maybeXL(width, height) {
        return (width <= ResponsiveTheme.XL) || (height <= ResponsiveTheme.XL);
    }
    static maybeXXL(width, height) {
        return (width <= ResponsiveTheme.XXL) || (height <= ResponsiveTheme.XXL);
    }
    /**
     * Instantiates the theme without adding default respomsive rules.
     */
    static newEmpty(root) {
        return (new this(root, true));
    }
    /**
     * Adds a responsive rule as well as retuns it.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/responsive/} for more info
     * @param   rule  Responsive rule
     * @return        Responsive rule
     */
    addRule(rule) {
        if (rule.name && !rule.template) {
            rule.template = this.rule(rule.name, rule.tags);
        }
        this.responsiveRules.push(rule);
        this._maybeApplyRule(rule);
        return rule;
    }
    /**
     * Removes the responsive rule.
     *
     * @param  rule  Responsive rule
     */
    removeRule(rule) {
        $array.remove(this.responsiveRules, rule);
    }
    dispose() {
        if (this._dp) {
            this._dp.dispose();
        }
    }
    _isUsed() {
        return this._root._rootContainer.get("themes").indexOf(this) !== -1;
    }
    _maybeApplyRules() {
        $array.each(this.responsiveRules, (rule) => {
            this._maybeUnapplyRule(rule);
        });
        $array.each(this.responsiveRules, (rule) => {
            this._maybeApplyRule(rule);
        });
    }
    _maybeApplyRule(rule) {
        if (rule.applied)
            return;
        const w = this._root._rootContainer.getPrivate("width");
        const h = this._root._rootContainer.getPrivate("height");
        const relevant = rule.relevant.call(rule, w, h);
        if (relevant) {
            rule.applied = true;
            if (rule.template && rule.settings) {
                rule.template.setAll(rule.settings);
            }
            if (rule.applying) {
                rule.applying.call(rule);
            }
        }
    }
    _maybeUnapplyRule(rule) {
        if (!rule.applied)
            return;
        const w = this._root._rootContainer.getPrivate("width");
        const h = this._root._rootContainer.getPrivate("height");
        const relevant = rule.relevant.call(rule, w, h);
        if (!relevant) {
            rule.applied = false;
            if (rule.template) {
                rule.template.removeAll();
            }
            if (rule.removing) {
                rule.removing.call(rule);
            }
        }
    }
    /**
     * Adds default rules for various chart types and most standard scenarios.
     */
    setupDefaultRules() {
        super.setupDefaultRules();
        const addRule = (rule) => this.addRule(rule);
        /**
         * ========================================================================
         * Universal
         * ========================================================================
         */
        addRule({
            name: "Chart",
            relevant: ResponsiveTheme.widthXXS,
            settings: {
                paddingLeft: 0,
                paddingRight: 0
            }
        });
        addRule({
            name: "Chart",
            relevant: ResponsiveTheme.heightXXS,
            settings: {
                paddingTop: 0,
                paddingBottom: 0
            }
        });
        addRule({
            name: "Bullet",
            relevant: ResponsiveTheme.isXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Legend",
            relevant: ResponsiveTheme.isXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "HeatLegend",
            tags: ["vertical"],
            relevant: ResponsiveTheme.widthXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "HeatLegend",
            tags: ["horizontal"],
            relevant: ResponsiveTheme.heightXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Label",
            tags: ["heatlegend", "start"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Label",
            tags: ["heatlegend", "end"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Button",
            tags: ["resize"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        /**
         * ========================================================================
         * XY
         * ========================================================================
         */
        addRule({
            name: "AxisRendererX",
            relevant: ResponsiveTheme.heightXS,
            settings: {
                inside: true
            }
        });
        addRule({
            name: "AxisRendererY",
            relevant: ResponsiveTheme.widthXS,
            settings: {
                inside: true
            }
        });
        addRule({
            name: "AxisRendererXLabel",
            relevant: ResponsiveTheme.heightXS,
            settings: {
                minPosition: 0.1,
                maxPosition: 0.9
            }
        });
        addRule({
            name: "AxisLabel",
            tags: ["y"],
            relevant: ResponsiveTheme.widthXS,
            settings: {
                centerY: p100,
                maxPosition: 0.9
            }
        });
        addRule({
            name: "AxisLabel",
            tags: ["x"],
            relevant: ResponsiveTheme.heightXXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "AxisLabel",
            tags: ["x", "minor"],
            relevant: ResponsiveTheme.widthXXL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "AxisLabel",
            tags: ["y"],
            relevant: ResponsiveTheme.widthXXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "AxisLabel",
            tags: ["y", "minor"],
            relevant: ResponsiveTheme.heightXXL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "AxisTick",
            tags: ["x"],
            relevant: ResponsiveTheme.heightXS,
            settings: {
                inside: true,
                minPosition: 0.1,
                maxPosition: 0.9
            }
        });
        addRule({
            name: "AxisTick",
            tags: ["y"],
            relevant: ResponsiveTheme.widthXXS,
            settings: {
                inside: true,
                minPosition: 0.1,
                maxPosition: 0.9
            }
        });
        addRule({
            name: "Grid",
            relevant: ResponsiveTheme.maybeXXS,
            settings: {
                forceHidden: true
            }
        });
        /**
         * ========================================================================
         * Radar
         * ========================================================================
         */
        addRule({
            name: "RadialLabel",
            tags: ["radial"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "RadialLabel",
            tags: ["circular"],
            relevant: ResponsiveTheme.maybeS,
            settings: {
                inside: true
            }
        });
        addRule({
            name: "AxisTick",
            relevant: ResponsiveTheme.maybeS,
            settings: {
                inside: true
            }
        });
        addRule({
            name: "RadialLabel",
            tags: ["circular"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "AxisTick",
            tags: ["circular"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                inside: true
            }
        });
        /**
         * ========================================================================
         * Pie
         * ========================================================================
         */
        addRule({
            name: "PieChart",
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                radius: percent(99)
            }
        });
        addRule({
            name: "PieChart",
            relevant: ResponsiveTheme.widthM,
            settings: {
                radius: percent(99)
            }
        });
        addRule({
            name: "RadialLabel",
            tags: ["pie"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "RadialLabel",
            tags: ["pie"],
            relevant: ResponsiveTheme.widthM,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["pie"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["pie"],
            relevant: ResponsiveTheme.widthM,
            settings: {
                forceHidden: true
            }
        });
        /**
         * ========================================================================
         * Funnel
         * ========================================================================
         */
        addRule({
            name: "FunnelSeries",
            relevant: ResponsiveTheme.widthM,
            settings: {
                alignLabels: false
            }
        });
        addRule({
            name: "Label",
            tags: ["funnel", "vertical"],
            relevant: ResponsiveTheme.widthL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["funnel", "vertical"],
            relevant: ResponsiveTheme.widthL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Label",
            tags: ["funnel", "horizontal"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["funnel", "horizontal"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        /**
         * ========================================================================
         * Pyramid
         * ========================================================================
         */
        addRule({
            name: "PyramidSeries",
            relevant: ResponsiveTheme.widthM,
            settings: {
                alignLabels: false
            }
        });
        addRule({
            name: "Label",
            tags: ["pyramid", "vertical"],
            relevant: ResponsiveTheme.widthL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["pyramid", "vertical"],
            relevant: ResponsiveTheme.widthL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Label",
            tags: ["pyramid", "horizontal"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["pyramid", "horizontal"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        /**
         * ========================================================================
         * Pictorial
         * ========================================================================
         */
        addRule({
            name: "PictorialStackedSeries",
            relevant: ResponsiveTheme.widthM,
            settings: {
                alignLabels: false
            }
        });
        addRule({
            name: "Label",
            tags: ["pictorial", "vertical"],
            relevant: ResponsiveTheme.widthL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["pictorial", "vertical"],
            relevant: ResponsiveTheme.widthL,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Label",
            tags: ["pictorial", "horizontal"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Tick",
            tags: ["pictorial", "horizontal"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        /**
         * ========================================================================
         * Map
         * ========================================================================
         */
        // Nothing to do here
        /**
         * ========================================================================
         * Flow (Sankey+Chord)
         * ========================================================================
         */
        addRule({
            name: "Label",
            tags: ["flow", "horizontal"],
            relevant: ResponsiveTheme.widthS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Label",
            tags: ["flow", "vertical"],
            relevant: ResponsiveTheme.heightS,
            settings: {
                forceHidden: true
            }
        });
        addRule({
            name: "Chord",
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                radius: percent(99)
            }
        });
        /**
         * ========================================================================
         * Hierarchy (Treemap, Partition, Sunburst, Pack, ForceDirected)
         * ========================================================================
         */
        addRule({
            name: "Label",
            tags: ["hierarchy", "node"],
            relevant: ResponsiveTheme.maybeXS,
            settings: {
                forceHidden: true
            }
        });
    }
}
// Named pixel breakpoints
Object.defineProperty(ResponsiveTheme, "XXS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 100
});
Object.defineProperty(ResponsiveTheme, "XS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 200
});
Object.defineProperty(ResponsiveTheme, "S", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 300
});
Object.defineProperty(ResponsiveTheme, "M", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 400
});
Object.defineProperty(ResponsiveTheme, "L", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 600
});
Object.defineProperty(ResponsiveTheme, "XL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 800
});
Object.defineProperty(ResponsiveTheme, "XXL", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 1000
});
//# sourceMappingURL=ResponsiveTheme.js.map
import { Template } from "./util/Template";
import * as $order from "./util/Order";
import * as $array from "./util/Array";
/**
 * A base class for an amCharts theme.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/themes/} for more info
 * @important
 */
export class Theme {
    constructor(root, isReal) {
        Object.defineProperty(this, "_root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rules", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this._root = root;
        if (!isReal) {
            throw new Error("You cannot use `new Class()`, instead use `Class.new()`");
        }
    }
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @param   settings  Settings
     * @param   template  Template
     * @return            Instantiated object
     */
    static new(root) {
        const x = (new this(root, true));
        x.setupDefaultRules();
        return x;
    }
    setupDefaultRules() { }
    /**
     * Looks up the rules for a specific theme class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/themes/} for more info
     * @param   themeClass Theme class
     * @return             Array<IRule<A>>
     */
    _lookupRules(themeClass) {
        return this._rules[themeClass];
    }
    /**
     * Creates a [[Template]] for specific theme class and tags.
     *
     * NOTE: the difference from `rule()` is that `ruleRaw()` does not do any
     * type checks.
     *
     * @see {@link https://www.amcharts.com/docs/v5/themes/} for more info
     * @param   themeClass Theme class
     * @param   themeTags  Theme tags
     * @return             Template
     */
    ruleRaw(themeClass, themeTags = []) {
        let rules = this._rules[themeClass];
        if (!rules) {
            rules = this._rules[themeClass] = [];
        }
        themeTags.sort($order.compare);
        const { index, found } = $array.getSortedIndex(rules, (x) => {
            const order = $order.compare(x.tags.length, themeTags.length);
            if (order === 0) {
                return $order.compareArray(x.tags, themeTags, $order.compare);
            }
            else {
                return order;
            }
        });
        if (found) {
            return rules[index].template;
        }
        else {
            const template = Template.new({});
            rules.splice(index, 0, {
                tags: themeTags,
                template,
            });
            return template;
        }
    }
    /**
     * Creates a [[Template]] for specific theme class and tags.
     *
     * @see {@link https://www.amcharts.com/docs/v5/themes/} for more info
     * @param   themeClass Theme class
     * @param   themeTags  Theme tags
     * @return             Template
     */
    rule(themeClass, themeTags = []) {
        return this.ruleRaw(themeClass, themeTags);
    }
}
//# sourceMappingURL=Theme.js.map
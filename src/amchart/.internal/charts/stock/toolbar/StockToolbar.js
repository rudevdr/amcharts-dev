import { Entity } from "../../../core/util/Entity";
import StockToolbarCSS from "./StockToolbarCSS";
import * as $array from "../../../core/util/Array";
import * as $utils from "../../../core/util/Utils";
/**
 * Builds a toolbar for [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/} for more info
 */
export class StockToolbar extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_cssDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        // Inherit default themes from chart
        this._defaultThemes = this.get("stockChart")._defaultThemes;
        super._afterNewApplyThemes();
        this._initControls();
        this.loadDefaultCSS();
        this._root.addDisposer(this);
        this.events.dispatch("created", {
            type: "created",
            target: this
        });
    }
    _afterChanged() {
        super._afterChanged();
        if (this.isDirty("container")) {
            // TODO
        }
        if (this.isDirty("useDefaultCSS")) {
            if (this.get("useDefaultCSS")) {
                this.loadDefaultCSS();
            }
            else if (this._cssDisposer) {
                this._cssDisposer.dispose();
            }
        }
        if (this.isDirty("controls")) {
            this._initControls();
        }
    }
    _dispose() {
        super._dispose();
        if (this._cssDisposer) {
            this._cssDisposer.dispose();
        }
        const controls = this.get("controls", []);
        $array.each(controls, (control, _index) => {
            control.dispose();
        });
    }
    _initControls() {
        const controls = this.get("controls", []);
        $array.each(controls, (control, _index) => {
            if (!control.getPrivate("toolbar")) {
                // @todo insert at specific index
                control.setPrivate("toolbar", this);
                this.get("container").appendChild(control.getPrivate("button"));
            }
        });
    }
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    loadDefaultCSS() {
        const disposer = StockToolbarCSS($utils.getShadowRoot(this._root.dom), this._root);
        this._disposers.push(disposer);
        this._cssDisposer = disposer;
    }
}
Object.defineProperty(StockToolbar, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StockToolbar"
});
Object.defineProperty(StockToolbar, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([StockToolbar.className])
});
//# sourceMappingURL=StockToolbar.js.map
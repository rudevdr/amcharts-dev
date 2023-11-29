import { HierarchyDefaultTheme } from "./HierarchyDefaultTheme";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $utils from "../../core/util/Utils";
/**
 * Creates a breadcrumb navigation control.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/breadcrumbs/} for more info
 * @important
 */
export class BreadcrumbBar extends Container {
    constructor() {
        super(...arguments);
        /**
         * A list of labels in the bar.
         *
         * `labels.template` can be used to configure label apperance and behavior.
         *
         * @default new ListTemplate<Label>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Label._new(this._root, {
                themeTags: $utils.mergeTags(this.labels.template.get("themeTags", []), ["label"]),
                background: RoundedRectangle.new(this._root, {
                    themeTags: ["background"]
                })
            }, [this.labels.template]))
        });
        Object.defineProperty(this, "_disposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * @ignore
     */
    makeLabel(dataItem) {
        const label = this.labels.make();
        label._setDataItem(dataItem);
        label.states.create("hover", {});
        label.states.create("down", {});
        label.events.on("click", () => {
            const series = this.get("series");
            if (series) {
                series.selectDataItem(dataItem);
            }
        });
        this.labels.push(label);
        return label;
    }
    _afterNew() {
        this._defaultThemes.push(HierarchyDefaultTheme.new(this._root));
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["breadcrumb"]);
        super._afterNew();
    }
    _changed() {
        super._changed();
        if (this.isDirty("series")) {
            const series = this.get("series");
            const previous = this._prevSettings.series;
            if (series != previous) {
                this._disposer = series.events.on("dataitemselected", (event) => {
                    this._handleDataItem(event.dataItem);
                });
            }
            else if (previous) {
                if (this._disposer) {
                    this._disposer.dispose();
                }
            }
            this._handleDataItem(series.get("selectedDataItem"));
        }
    }
    _handleDataItem(dataItem) {
        this.set("minHeight", this.height());
        this.children.clear();
        this.labels.clear();
        if (dataItem) {
            let parent = dataItem;
            while (parent) {
                let label = this.makeLabel(parent);
                if (parent == dataItem) {
                    label.addTag("last");
                }
                this.children.moveValue(label, 0);
                parent = parent.get("parent");
            }
        }
    }
}
Object.defineProperty(BreadcrumbBar, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "BreadcrumbBar"
});
Object.defineProperty(BreadcrumbBar, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([BreadcrumbBar.className])
});
//# sourceMappingURL=BreadcrumbBar.js.map
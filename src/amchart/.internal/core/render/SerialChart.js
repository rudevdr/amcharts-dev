import { Chart } from "./Chart";
import { Container } from "../../core/render/Container";
import { ListAutoDispose } from "../../core/util/List";
import { p100 } from "../../core/util/Percent";
import * as $array from "../../core/util/Array";
/**
 * A base class for all series-based charts.
 */
export class SerialChart extends Chart {
    constructor() {
        super(...arguments);
        /**
         * A [[Container]] where chart will store all series.
         *
         * @default Container.new()
         */
        Object.defineProperty(this, "seriesContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Container.new(this._root, { width: p100, height: p100, isMeasured: false })
        });
        /**
         * A list of chart's series.
         */
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListAutoDispose()
        });
    }
    _afterNew() {
        super._afterNew();
        this._disposers.push(this.series);
        const children = this.seriesContainer.children;
        this._disposers.push(this.series.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (series) => {
                    this._removeSeries(series);
                });
                const colors = this.get("colors");
                if (colors) {
                    colors.reset();
                }
            }
            else if (change.type === "push") {
                children.moveValue(change.newValue);
                this._processSeries(change.newValue);
            }
            else if (change.type === "setIndex") {
                children.setIndex(change.index, change.newValue);
                this._processSeries(change.newValue);
            }
            else if (change.type === "insertIndex") {
                children.insertIndex(change.index, change.newValue);
                this._processSeries(change.newValue);
            }
            else if (change.type === "removeIndex") {
                this._removeSeries(change.oldValue);
            }
            else if (change.type === "moveIndex") {
                children.moveValue(change.value, change.newIndex);
                this._processSeries(change.value);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        }));
    }
    _processSeries(series) {
        series.chart = this;
        series._placeBulletsContainer(this);
    }
    _removeSeries(series) {
        if (!series.isDisposed()) {
            this.seriesContainer.children.removeValue(series);
            series._removeBulletsContainer();
        }
    }
}
Object.defineProperty(SerialChart, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SerialChart"
});
Object.defineProperty(SerialChart, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Chart.classNames.concat([SerialChart.className])
});
//# sourceMappingURL=SerialChart.js.map
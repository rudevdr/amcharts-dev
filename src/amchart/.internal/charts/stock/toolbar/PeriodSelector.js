import { StockControl } from "./StockControl";
import { MultiDisposer } from "../../../core/util/Disposer";
import * as $utils from "../../../core/util/Utils";
import * as $time from "../../../core/util/Time";
import * as $array from "../../../core/util/Array";
/**
 * A pre-defined period selector control for [[StockToolback]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/period-selector/} for more info
 */
export class PeriodSelector extends StockControl {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_groupChangedDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_groupChangedTo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        const button = this.getPrivate("button");
        button.className = button.className + " am5stock-no-hover";
        this._initPeriodButtons();
    }
    _initPeriodButtons() {
        const container = this.getPrivate("label");
        container.style.display = "";
        const periods = this.get("periods", []);
        const axis = this._getAxis();
        this.setPrivate("deferTimeout", this.setTimeout(() => this.setPrivate("deferReset", false), axis.get("interpolationDuration", 1000) + 200));
        axis.onPrivate("min", () => this._setPeriodButtonStatus());
        axis.onPrivate("max", () => this._setPeriodButtonStatus());
        $array.each(periods, (period) => {
            const button = document.createElement("a");
            button.innerHTML = period.name || (period.timeUnit.toUpperCase() + period.count || "1");
            button.className = "am5stock-link";
            button.setAttribute("data-period", period.timeUnit + (period.count || ""));
            container.appendChild(button);
            this._disposers.push($utils.addEventListener(button, "click", (_ev) => {
                this.setPrivate("deferReset", false);
                this._resetActiveButtons();
                this.selectPeriod(period);
                this.setPrivate("deferReset", true);
                $utils.addClass(button, "am5stock-active");
                const timeout = this.getPrivate("deferTimeout");
                if (timeout) {
                    timeout.dispose();
                }
            }));
        });
    }
    _resetActiveButtons() {
        if (this.getPrivate("deferReset") !== true) {
            const container = this.getPrivate("label");
            const buttons = container.getElementsByClassName("am5stock-active");
            $array.each(buttons, (b) => {
                $utils.removeClass(b, "am5stock-active");
            });
            let axis = this.getPrivate("axis");
            if (!axis) {
                axis = this._getAxis();
                this.setPrivate("axis", axis);
                this._disposers.push(new MultiDisposer([
                    axis.on("start", () => this._resetActiveButtons()),
                    axis.on("end", () => this._resetActiveButtons())
                ]));
            }
        }
    }
    _setPeriodButtonStatus() {
        if (this.get("hideLongPeriods")) {
            let axis = this.getPrivate("axis");
            const container = this.getPrivate("label");
            const buttons = container.getElementsByTagName("a");
            if (!axis) {
                axis = this._getAxis();
                const min = axis.getPrivate("min", 0);
                const max = axis.getPrivate("max", 0);
                if (min && max) {
                    const diff = max - min;
                    const periods = this.get("periods", []);
                    $array.each(periods, (period) => {
                        if (period.timeUnit !== "ytd" && period.timeUnit !== "max") {
                            const plen = $time.getDuration(period.timeUnit, period.count || 1);
                            const id = period.timeUnit + (period.count || "");
                            for (let i = 0; i < buttons.length; i++) {
                                const button = buttons[i];
                                if (button.getAttribute("data-period") == id) {
                                    if (plen > diff) {
                                        $utils.addClass(button, "am5stock-hidden");
                                    }
                                    else {
                                        $utils.removeClass(button, "am5stock-hidden");
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    }
    // protected _getDefaultIcon(): SVGElement {
    // 	return StockIcons.getIcon("Period");
    // }
    _afterChanged() {
        super._afterChanged();
        // if (this.isDirty("active")) {
        // 	this._initDropdown();
        // }
    }
    _getChart() {
        return this.get("stockChart").panels.getIndex(0);
    }
    _getAxis() {
        return this._getChart().xAxes.getIndex(0);
    }
    selectPeriod(period) {
        const fromStart = this.get("zoomTo", "end") == "start";
        this._highlightPeriod(period);
        if (period.timeUnit == "max") {
            this._getChart().zoomOut();
        }
        else if (period.timeUnit == "custom") {
            const axis = this._getAxis();
            let start = period.start || new Date(axis.getPrivate("min"));
            let end = period.end || new Date(axis.getPrivate("max"));
            axis.zoomToDates(start, end);
        }
        else {
            const axis = this._getAxis();
            let end = new Date(axis.getPrivate("max"));
            let start;
            if (period.timeUnit == "ytd") {
                start = new Date(end.getFullYear(), 0, 1, 0, 0, 0, 0);
                end = new Date(axis.getIntervalMax(axis.get("baseInterval")));
                if (axis.get("groupData")) {
                    axis.zoomToDates(start, end, 0);
                    setTimeout(() => {
                        axis.zoomToDates(start, end, 0);
                    }, 10);
                    return;
                }
            }
            else {
                const timeUnit = period.timeUnit;
                // some adjustments in case data is grouped
                if (axis.get("groupData")) {
                    // find interval which will be used after zoom
                    const interval = axis.getGroupInterval($time.getDuration(timeUnit, period.count));
                    if (interval) {
                        const firstDay = this._root.locale.firstDayOfWeek;
                        const timezone = this._root.timezone;
                        const utc = this._root.utc;
                        if (fromStart) {
                            let startTime = axis.getIntervalMin(axis.get("baseInterval"));
                            start = new Date(axis.getPrivate("max"));
                            if (startTime != null) {
                                // round to the previuous interval
                                start = $time.round(new Date(startTime), interval.timeUnit, interval.count, firstDay, utc, undefined, timezone);
                                start.setTime(start.getTime() + $time.getDuration(interval.timeUnit, interval.count * .95));
                                start = $time.round(start, interval.timeUnit, interval.count, firstDay, utc, undefined, timezone);
                            }
                            end = $time.add(new Date(start), timeUnit, (period.count || 1));
                        }
                        else {
                            // find max of the base interval
                            let endTime = axis.getIntervalMax(axis.get("baseInterval"));
                            if (endTime != null) {
                                // round to the future interval
                                end = $time.round(new Date(endTime), interval.timeUnit, interval.count, firstDay, utc, undefined, timezone);
                                end.setTime(end.getTime() + $time.getDuration(interval.timeUnit, interval.count * 1.05));
                                end = $time.round(end, interval.timeUnit, interval.count, firstDay, utc, undefined, timezone);
                            }
                            start = $time.add(new Date(end), timeUnit, (period.count || 1) * -1);
                        }
                        if (this._groupChangedDp) {
                            this._groupChangedDp.dispose();
                            this._groupChangedDp = undefined;
                        }
                        if (this._groupChangedTo) {
                            this._groupChangedTo.dispose();
                        }
                        this._groupChangedDp = axis.events.once("groupintervalchanged", () => {
                            axis.zoomToDates(start, end, 0);
                        });
                        axis.zoomToDates(start, end, 0);
                        this._groupChangedTo = this.setTimeout(() => {
                            if (this._groupChangedDp) {
                                this._groupChangedDp.dispose();
                            }
                            this._groupChangedTo = undefined;
                        }, 500);
                        return;
                    }
                }
                if (fromStart) {
                    start = new Date(axis.getPrivate("min"));
                    end = $time.add(new Date(start), timeUnit, (period.count || 1));
                }
                else {
                    start = $time.add(new Date(end), timeUnit, (period.count || 1) * -1);
                }
            }
            axis.zoomToDates(start, end);
        }
    }
    _highlightPeriod(period) {
        const id = period.timeUnit + (period.count || "");
        const container = this.getPrivate("label");
        const buttons = container.getElementsByTagName("a");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            if (button.getAttribute("data-period") == id && id != "custom") {
                $utils.addClass(button, "am5stock-active");
            }
            else {
                $utils.removeClass(button, "am5stock-active");
            }
        }
    }
}
Object.defineProperty(PeriodSelector, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PeriodSelector"
});
Object.defineProperty(PeriodSelector, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([PeriodSelector.className])
});
//# sourceMappingURL=PeriodSelector.js.map
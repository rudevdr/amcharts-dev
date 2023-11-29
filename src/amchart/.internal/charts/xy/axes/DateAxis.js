import { DataItem } from "../../../core/render/Component";
import { ValueAxis } from "./ValueAxis";
import * as $type from "../../../core/util/Type";
import * as $order from "../../../core/util/Order";
import * as $array from "../../../core/util/Array";
import * as $object from "../../../core/util/Object";
import * as $utils from "../../../core/util/Utils";
import * as $time from "../../../core/util/Time";
/**
 * Creates a date axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/} for more info
 * @important
 */
export class DateAxis extends ValueAxis {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_dataGrouped", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_seriesDataGrouped", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_groupingCalculated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_intervalDuration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_baseDuration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_intervalMax", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_intervalMin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["axis"]);
        super._afterNew();
        this._setBaseInterval(this.get("baseInterval"));
        this.on("baseInterval", () => {
            this._setBaseInterval(this.get("baseInterval"));
        });
    }
    _setBaseInterval(interval) {
        this.setPrivateRaw("baseInterval", interval);
        this._baseDuration = $time.getIntervalDuration(interval);
    }
    _fixZoomFactor() {
        const maxZoomFactor = this.get("maxZoomFactor");
        if (maxZoomFactor != null && maxZoomFactor != Infinity) {
            this.setPrivateRaw("maxZoomFactor", maxZoomFactor);
        }
        else {
            this.setPrivateRaw("maxZoomFactor", Math.round((this.getPrivate("max", 0) - this.getPrivate("min", 0)) / this.baseMainDuration()));
        }
    }
    _groupData() {
        const min = this.getPrivate("min");
        const max = this.getPrivate("max");
        if (($type.isNumber(min) && $type.isNumber(max))) {
            this._fixZoomFactor();
            const groupInterval = this.getPrivate("groupInterval");
            if (groupInterval) {
                this._setBaseInterval(groupInterval);
            }
            else {
                this._setBaseInterval(this.get("baseInterval"));
            }
            if (this.isDirty("groupInterval")) {
                let groupInterval = this.get("groupInterval");
                if (groupInterval) {
                    this.setRaw("groupIntervals", [groupInterval]);
                    this._handleRangeChange();
                }
            }
            if (this.isDirty("groupData")) {
                if (!this._dataGrouped) {
                    if (this.get("groupData")) {
                        $array.each(this.series, (series) => {
                            this._groupSeriesData(series);
                        });
                        this._handleRangeChange();
                    }
                    else {
                        let baseInterval = this.get("baseInterval");
                        let mainDataSetId = baseInterval.timeUnit + baseInterval.count;
                        $array.each(this.series, (series) => {
                            series.setDataSet(mainDataSetId);
                            series.resetGrouping();
                        });
                        this._setBaseInterval(baseInterval);
                        this.setPrivateRaw("groupInterval", undefined);
                        this.markDirtyExtremes();
                    }
                    this._dataGrouped = true;
                }
            }
        }
    }
    _groupSeriesData(series) {
        if (this.get("groupData") && !series.get("groupDataDisabled")) {
            this._dataGrouped = true; // helps to avoid double grouping
            this._seriesDataGrouped = true;
            // make array of intervals which will be used;
            let intervals = [];
            let baseDuration = this.baseMainDuration();
            let groupIntervals = this.get("groupIntervals");
            if (groupIntervals) { }
            $array.each(groupIntervals, (interval) => {
                let intervalDuration = $time.getIntervalDuration(interval);
                if (intervalDuration > baseDuration) {
                    intervals.push(interval);
                }
            });
            series._dataSets = {};
            const key = this.getPrivate("name") + this.get("renderer").getPrivate("letter");
            let fields;
            const baseAxis = series.get("baseAxis");
            if (series.get("xAxis") === baseAxis) {
                fields = series._valueYFields;
            }
            else if (series.get("yAxis") === baseAxis) {
                fields = series._valueXFields;
            }
            let dataItems = series._mainDataItems;
            let baseInterval = this.get("baseInterval");
            let mainDataSetId = baseInterval.timeUnit + baseInterval.count;
            series._dataSets[mainDataSetId] = dataItems;
            const groupCallback = series.get("groupDataCallback");
            let groupOriginals = series.get("groupDataWithOriginals", false);
            if (groupCallback) {
                groupOriginals = true;
            }
            const firstDay = this._root.locale.firstDayOfWeek;
            const utc = this._root.utc;
            const timezone = this._root.timezone;
            $array.each(intervals, (interval) => {
                let previousTime = -Infinity;
                let dataSetId = interval.timeUnit + interval.count;
                series._dataSets[dataSetId] = [];
                let newDataItem;
                let sum = {};
                let count = {};
                let groupFieldValues = {};
                let workingFields = {};
                $array.each(fields, (field) => {
                    sum[field] = 0;
                    count[field] = 0;
                    groupFieldValues[field] = series.get((field + "Grouped"));
                    workingFields[field] = field + "Working";
                });
                let intervalDuration = $time.getDuration(interval.timeUnit);
                let firstItem = dataItems[0];
                let firstDate;
                if (firstItem) {
                    firstDate = new Date(dataItems[0].get(key));
                }
                let prevNewDataItem;
                $array.each(dataItems, (dataItem) => {
                    let time = dataItem.get(key);
                    let roundedTime = $time.round(new Date(time), interval.timeUnit, interval.count, firstDay, utc, firstDate, timezone).getTime();
                    let dataContext;
                    if (previousTime < roundedTime - intervalDuration / 24) {
                        dataContext = $object.copy(dataItem.dataContext);
                        newDataItem = new DataItem(series, dataContext, series._makeDataItem(dataContext));
                        newDataItem.setRaw(key, roundedTime);
                        series._dataSets[dataSetId].push(newDataItem);
                        $array.each(fields, (field) => {
                            let value = dataItem.get(field);
                            if ($type.isNumber(value)) {
                                newDataItem.setRaw(field, value);
                                newDataItem.setRaw(workingFields[field], value);
                                count[field] = 1;
                                sum[field] = value;
                            }
                            else {
                                sum[field] = 0;
                                count[field] = 0;
                            }
                        });
                        if (groupOriginals) {
                            newDataItem.set("originals", [dataItem]);
                        }
                        if (groupCallback && prevNewDataItem) {
                            groupCallback(prevNewDataItem, interval);
                        }
                        prevNewDataItem = newDataItem;
                    }
                    else {
                        $array.each(fields, (field) => {
                            let groupKey = groupFieldValues[field];
                            let value = dataItem.get(field);
                            if (value != null) {
                                let currentValue = newDataItem.get(field);
                                switch (groupKey) {
                                    case "close":
                                        newDataItem.setRaw(field, value);
                                        break;
                                    case "sum":
                                        newDataItem.setRaw(field, currentValue + value);
                                        break;
                                    case "open":
                                        break;
                                    case "low":
                                        if (value < currentValue) {
                                            newDataItem.setRaw(field, value);
                                        }
                                        break;
                                    case "high":
                                        if (value > currentValue) {
                                            newDataItem.setRaw(field, value);
                                        }
                                        break;
                                    case "average":
                                        count[field]++;
                                        sum[field] += value;
                                        let average = sum[field] / count[field];
                                        newDataItem.setRaw(field, average);
                                        break;
                                    case "extreme":
                                        if (Math.abs(value) > Math.abs(currentValue)) {
                                            newDataItem.setRaw(field, value);
                                        }
                                        break;
                                }
                                newDataItem.setRaw(workingFields[field], newDataItem.get(field));
                                let dataContext = $object.copy(dataItem.dataContext);
                                dataContext[key] = roundedTime;
                                newDataItem.dataContext = dataContext;
                            }
                        });
                        if (groupOriginals) {
                            newDataItem.get("originals").push(dataItem);
                        }
                    }
                    previousTime = roundedTime;
                });
                if (groupCallback && prevNewDataItem) {
                    groupCallback(prevNewDataItem, interval);
                }
            });
            if (series._dataSetId) {
                series.setDataSet(series._dataSetId);
            }
            this.markDirtySize();
        }
    }
    _clearDirty() {
        super._clearDirty();
        this._groupingCalculated = false;
        this._dataGrouped = false;
    }
    /**
     * Returns a time interval axis would group data to for a specified duration.
     *
     * @since 5.2.1
     */
    getGroupInterval(duration) {
        let baseInterval = this.get("baseInterval");
        let groupInterval = $time.chooseInterval(0, duration, this.get("groupCount", Infinity), this.get("groupIntervals"));
        if ($time.getIntervalDuration(groupInterval) < $time.getIntervalDuration(baseInterval)) {
            groupInterval = Object.assign({}, baseInterval);
        }
        return groupInterval;
    }
    /**
     * Return `max` of a specified time interval.
     *
     * Will work only if the axis was grouped to this interval at least once.
     *
     * @since 5.2.1
     * @param   interval  Interval
     * @return            Max
     */
    getIntervalMax(interval) {
        return this._intervalMax[interval.timeUnit + interval.count];
    }
    /**
     * Return `min` of a specified time interval.
     *
     * Will work only if the axis was grouped to this interval at least once.
     *
     * @since 5.2.1
     * @param   interval  Interval
     * @return            Min
     */
    getIntervalMin(interval) {
        return this._intervalMin[interval.timeUnit + interval.count];
    }
    _handleRangeChange() {
        super._handleRangeChange();
        let selectionMin = Math.round(this.getPrivate("selectionMin"));
        let selectionMax = Math.round(this.getPrivate("selectionMax"));
        if ($type.isNumber(selectionMin) && $type.isNumber(selectionMax)) {
            if (this.get("endLocation") == 0) {
                selectionMax += 1;
            }
            if (this.get("groupData") && !this._groupingCalculated) {
                this._groupingCalculated = true;
                let modifiedDifference = (selectionMax - selectionMin) + (this.get("startLocation", 0) + (1 - this.get("endLocation", 1)) * this.baseDuration());
                let groupInterval = this.get("groupInterval");
                if (!groupInterval) {
                    groupInterval = this.getGroupInterval(modifiedDifference);
                }
                let current = this.getPrivate("groupInterval");
                if (groupInterval && (!current || (current.timeUnit !== groupInterval.timeUnit || current.count !== groupInterval.count) || this._seriesDataGrouped)) {
                    this._seriesDataGrouped = false;
                    this.setPrivateRaw("groupInterval", groupInterval);
                    this._setBaseInterval(groupInterval);
                    let newId = groupInterval.timeUnit + groupInterval.count;
                    $array.each(this.series, (series) => {
                        if (series.get("baseAxis") === this) {
                            series.setDataSet(newId);
                        }
                    });
                    this.markDirtyExtremes();
                    this._root.events.once("frameended", () => {
                        this._root.events.once("frameended", () => {
                            const type = "groupintervalchanged";
                            if (this.events.isEnabled(type)) {
                                this.events.dispatch(type, { type: type, target: this });
                            }
                        });
                    });
                }
            }
            $array.each(this.series, (series) => {
                if (series.get("baseAxis") === this) {
                    let fieldName = (this.getPrivate("name") + this.get("renderer").getPrivate("letter"));
                    const start = $array.getFirstSortedIndex(series.dataItems, (dataItem) => {
                        return $order.compare(dataItem.get(fieldName), selectionMin);
                    });
                    let startIndex = start.index;
                    if (startIndex > 0) {
                        startIndex -= 1;
                    }
                    selectionMax += this.baseDuration() * (1 - this.get("endLocation", 1));
                    const end = $array.getSortedIndex(series.dataItems, (dataItem) => {
                        return $order.compare(dataItem.get(fieldName), selectionMax);
                    });
                    let endIndex = end.index;
                    let endIndex2 = endIndex;
                    if (endIndex2 > 1) {
                        endIndex2--;
                    }
                    const firstDataItem = series.dataItems[startIndex];
                    const lastDataItem = series.dataItems[endIndex2];
                    let lastDate;
                    let firstDate;
                    if (firstDataItem) {
                        firstDate = firstDataItem.get(fieldName);
                    }
                    if (lastDataItem) {
                        lastDate = lastDataItem.get(fieldName);
                    }
                    let outOfSelection = false;
                    if (lastDate != null && firstDate != null) {
                        if (lastDate < selectionMin || firstDate > selectionMax) {
                            outOfSelection = true;
                        }
                    }
                    series.setPrivate("outOfSelection", outOfSelection);
                    series.setPrivate("startIndex", startIndex);
                    series.setPrivate("endIndex", endIndex);
                }
            });
        }
    }
    _adjustMinMax(min, max, gridCount, _strictMode) {
        return { min: min, max: max, step: (max - min) / gridCount };
    }
    /**
     * @ignore
     */
    intervalDuration() {
        return this._intervalDuration;
    }
    _saveMinMax(min, max) {
        let groupInterval = this.getPrivate("groupInterval");
        if (!groupInterval) {
            groupInterval = this.get("baseInterval");
        }
        let id = groupInterval.timeUnit + groupInterval.count;
        this._intervalMin[id] = min;
        this._intervalMax[id] = max;
    }
    _getM(timeUnit) {
        if (timeUnit == "month" || timeUnit == "year" || timeUnit == "day") {
            return 1.05;
        }
        return 1.01;
    }
    _getMinorInterval(interval) {
        let minorGridInterval;
        let count = interval.count;
        let timeUnit = interval.timeUnit;
        if (count > 1) {
            if (count == 10) {
                count = 5;
            }
            else if (count == 15) {
                count = 5;
            }
            else if (count == 12) {
                count = 2;
            }
            else if (count == 6) {
                count = 1;
            }
            else if (count == 30) {
                count = 10;
            }
            else if (count < 10) {
                count = 1;
            }
            minorGridInterval = { timeUnit: timeUnit, count: count };
        }
        if (timeUnit == "week") {
            minorGridInterval = { timeUnit: "day", count: 1 };
        }
        return minorGridInterval;
    }
    _prepareAxisItems() {
        const min = this.getPrivate("min");
        const max = this.getPrivate("max");
        if ($type.isNumber(min) && $type.isNumber(max)) {
            const selectionMin = Math.round(this.getPrivate("selectionMin"));
            const selectionMax = Math.round(this.getPrivate("selectionMax"));
            const renderer = this.get("renderer");
            const baseInterval = this.getPrivate("baseInterval");
            let value = selectionMin;
            let i = 0;
            const intervals = this.get("gridIntervals");
            let gridInterval = $time.chooseInterval(0, selectionMax - selectionMin, renderer.gridCount(), intervals);
            if ($time.getIntervalDuration(gridInterval) < this.baseDuration()) {
                gridInterval = Object.assign({}, baseInterval);
            }
            const intervalDuration = $time.getIntervalDuration(gridInterval);
            this._intervalDuration = intervalDuration;
            const nextGridUnit = $time.getNextUnit(gridInterval.timeUnit);
            const firstDay = this._root.locale.firstDayOfWeek;
            const utc = this._root.utc;
            const timezone = this._root.timezone;
            value = $time.round(new Date(selectionMin - intervalDuration), gridInterval.timeUnit, gridInterval.count, firstDay, utc, new Date(min), timezone).getTime();
            let previousValue = value - intervalDuration;
            let format;
            const formats = this.get("dateFormats");
            this.setPrivateRaw("gridInterval", gridInterval);
            const minorLabelsEnabled = renderer.get("minorLabelsEnabled");
            const minorGridEnabled = renderer.get("minorGridEnabled", minorLabelsEnabled);
            let minorGridInterval;
            let minorDuration = 0;
            if (minorGridEnabled) {
                minorGridInterval = this._getMinorInterval(gridInterval);
                minorDuration = $time.getIntervalDuration(minorGridInterval);
            }
            let m = 0;
            while (value < selectionMax + intervalDuration) {
                let dataItem;
                if (this.dataItems.length < i + 1) {
                    dataItem = new DataItem(this, undefined, {});
                    this._dataItems.push(dataItem);
                    this.processDataItem(dataItem);
                }
                else {
                    dataItem = this.dataItems[i];
                }
                this._createAssets(dataItem, []);
                this._toggleDataItem(dataItem, true);
                dataItem.setRaw("value", value);
                dataItem.setRaw("labelEndValue", undefined);
                let endValue = value + $time.getDuration(gridInterval.timeUnit, gridInterval.count * this._getM(gridInterval.timeUnit));
                endValue = $time.round(new Date(endValue), gridInterval.timeUnit, 1, firstDay, utc, undefined, timezone).getTime();
                dataItem.setRaw("endValue", endValue);
                let date = new Date(value);
                format = formats[gridInterval.timeUnit];
                if (nextGridUnit && this.get("markUnitChange") && $type.isNumber(previousValue)) {
                    if (gridInterval.timeUnit != "year") {
                        if ($time.checkChange(value, previousValue, nextGridUnit, utc, timezone)) {
                            format = this.get("periodChangeDateFormats")[gridInterval.timeUnit];
                        }
                    }
                }
                const label = dataItem.get("label");
                if (label) {
                    label.set("text", this._root.dateFormatter.format(date, format));
                }
                let count = gridInterval.count;
                // so that labels of week would always be at the beginning of the grid
                if (gridInterval.timeUnit == "week") {
                    dataItem.setRaw("labelEndValue", value);
                }
                if (minorGridEnabled) {
                    count = 1;
                    let timeUnit = gridInterval.timeUnit;
                    if (timeUnit == "week") {
                        timeUnit = "day";
                    }
                    let labelEndValue = value + $time.getDuration(timeUnit, this._getM(timeUnit));
                    labelEndValue = $time.round(new Date(labelEndValue), timeUnit, 1, firstDay, utc, undefined, timezone).getTime();
                    dataItem.setRaw("labelEndValue", labelEndValue);
                }
                this._prepareDataItem(dataItem, count);
                previousValue = value;
                value = endValue;
                // min grid
                if (minorGridInterval) {
                    let minorValue = $time.round(new Date(previousValue + minorDuration * this._getM(minorGridInterval.timeUnit)), minorGridInterval.timeUnit, minorGridInterval.count, firstDay, utc, new Date(previousValue), timezone).getTime();
                    let previousMinorValue;
                    let minorFormats = this.get("minorDateFormats", this.get("dateFormats"));
                    while (minorValue < value - 0.01 * minorDuration) {
                        let minorDataItem;
                        if (this.minorDataItems.length < m + 1) {
                            minorDataItem = new DataItem(this, undefined, {});
                            this.minorDataItems.push(minorDataItem);
                            this.processDataItem(minorDataItem);
                        }
                        else {
                            minorDataItem = this.minorDataItems[m];
                        }
                        this._createAssets(minorDataItem, ["minor"], true);
                        this._toggleDataItem(minorDataItem, true);
                        minorDataItem.setRaw("value", minorValue);
                        let minorEndValue = minorValue + $time.getDuration(minorGridInterval.timeUnit, minorGridInterval.count * this._getM(minorGridInterval.timeUnit));
                        minorEndValue = $time.round(new Date(minorEndValue), minorGridInterval.timeUnit, 1, firstDay, utc, undefined, timezone).getTime();
                        minorDataItem.setRaw("endValue", minorEndValue);
                        let date = new Date(minorValue);
                        format = minorFormats[minorGridInterval.timeUnit];
                        const minorLabel = minorDataItem.get("label");
                        if (minorLabel) {
                            if (minorLabelsEnabled) {
                                minorLabel.set("text", this._root.dateFormatter.format(date, format));
                            }
                            else {
                                minorLabel.setPrivate("visible", false);
                            }
                        }
                        this._prepareDataItem(minorDataItem, 1);
                        if (minorValue == previousMinorValue) {
                            break;
                        }
                        previousMinorValue = minorValue;
                        minorValue = minorEndValue;
                        m++;
                    }
                }
                if (value == previousValue) {
                    break;
                }
                i++;
            }
            for (let j = i; j < this.dataItems.length; j++) {
                this._toggleDataItem(this.dataItems[j], false);
            }
            for (let j = m; j < this.minorDataItems.length; j++) {
                this._toggleDataItem(this.minorDataItems[j], false);
            }
            $array.each(this.series, (series) => {
                if (series.inited) {
                    series._markDirtyAxes();
                }
            });
        }
        this._updateGhost();
    }
    _updateFinals(start, end) {
        this.setPrivateRaw("selectionMinFinal", this.positionToValue(start));
        this.setPrivateRaw("selectionMaxFinal", this.positionToValue(end));
    }
    _getDelta() {
        this._deltaMinMax = this.baseDuration() / 2;
    }
    _fixMin(min) {
        const baseInterval = this.getPrivate("baseInterval");
        const firstDay = this._root.locale.firstDayOfWeek;
        const timezone = this._root.timezone;
        const utc = this._root.utc;
        const timeUnit = baseInterval.timeUnit;
        let startTime = $time.round(new Date(min), timeUnit, baseInterval.count, firstDay, utc, undefined, timezone).getTime();
        let endTime = startTime + $time.getDuration(timeUnit, baseInterval.count * this._getM(timeUnit));
        endTime = $time.round(new Date(endTime), timeUnit, 1, firstDay, utc, undefined, timezone).getTime();
        return startTime + (endTime - startTime) * this.get("startLocation", 0);
    }
    _fixMax(max) {
        const baseInterval = this.getPrivate("baseInterval");
        const firstDay = this._root.locale.firstDayOfWeek;
        const timezone = this._root.timezone;
        const utc = this._root.utc;
        const timeUnit = baseInterval.timeUnit;
        let startTime = $time.round(new Date(max), timeUnit, baseInterval.count, firstDay, utc, undefined, timezone).getTime();
        let endTime = startTime + $time.getDuration(timeUnit, baseInterval.count * this._getM(timeUnit));
        endTime = $time.round(new Date(endTime), timeUnit, 1, firstDay, utc, undefined, timezone).getTime();
        return startTime + (endTime - startTime) * this.get("endLocation", 1);
    }
    _updateDates(_date, _series) {
    }
    /**
     * Returns a duration of currently active `baseInterval` in milliseconds.
     *
     * @return Duration
     */
    baseDuration() {
        return this._baseDuration;
        //return $time.getIntervalDuration(this.getPrivate("baseInterval"));
    }
    /**
     * Returns a duration of user-defined `baseInterval` in milliseconds.
     *
     * @return Duration
     */
    baseMainDuration() {
        return $time.getIntervalDuration(this.get("baseInterval"));
    }
    /**
     * @ignore
     */
    processSeriesDataItem(dataItem, fields) {
        const baseInterval = this.getPrivate("baseInterval");
        if (!dataItem.open) {
            dataItem.open = {};
        }
        if (!dataItem.close) {
            dataItem.close = {};
        }
        $array.each(fields, (field) => {
            let value = dataItem.get(field);
            if ($type.isNumber(value)) {
                let startTime = dataItem.open[field];
                let endTime = dataItem.close[field];
                // this is done to save cpu, as rounding is quite expensive, especially with timezone set. 
                // if value is between prev start and end, it means it didn't change, all is fine.
                if (value >= startTime && value <= endTime) {
                }
                else {
                    const firstDay = this._root.locale.firstDayOfWeek;
                    const utc = this._root.utc;
                    const timezone = this._root.timezone;
                    const timeUnit = baseInterval.timeUnit;
                    const count = baseInterval.count;
                    startTime = $time.round(new Date(value), timeUnit, count, firstDay, utc, undefined, timezone).getTime();
                    endTime = startTime + $time.getDuration(timeUnit, count * this._getM(timeUnit));
                    endTime = $time.round(new Date(endTime), timeUnit, 1, firstDay, utc, undefined, timezone).getTime();
                    dataItem.open[field] = startTime;
                    dataItem.close[field] = endTime;
                }
                this._updateDates(startTime, dataItem.component);
            }
        });
    }
    /**
     * @ignore
     */
    getDataItemPositionX(dataItem, field, cellLocation, axisLocation) {
        let openValue;
        let closeValue;
        if (dataItem.open && dataItem.close) {
            openValue = dataItem.open[field];
            closeValue = dataItem.close[field];
        }
        else {
            openValue = dataItem.get(field);
            closeValue = openValue;
        }
        let value = openValue + (closeValue - openValue) * cellLocation;
        value = this._baseValue + (value - this._baseValue) * axisLocation;
        return this.valueToPosition(value);
    }
    /**
     * @ignore
     */
    getDataItemCoordinateX(dataItem, field, cellLocation, axisLocation) {
        return this._settings.renderer.positionToCoordinate(this.getDataItemPositionX(dataItem, field, cellLocation, axisLocation));
    }
    /**
     * @ignore
     */
    getDataItemPositionY(dataItem, field, cellLocation, axisLocation) {
        let openValue;
        let closeValue;
        if (dataItem.open && dataItem.close) {
            openValue = dataItem.open[field];
            closeValue = dataItem.close[field];
        }
        else {
            openValue = dataItem.get(field);
            closeValue = openValue;
        }
        let value = openValue + (closeValue - openValue) * cellLocation;
        value = this._baseValue + (value - this._baseValue) * axisLocation;
        return this.valueToPosition(value);
    }
    /**
     * @ignore
     */
    getDataItemCoordinateY(dataItem, field, cellLocation, axisLocation) {
        return this._settings.renderer.positionToCoordinate(this.getDataItemPositionY(dataItem, field, cellLocation, axisLocation));
    }
    /**
     * @ignore
     */
    roundAxisPosition(position, location) {
        let value = this.positionToValue(position);
        value = value - (location - 0.5) * this.baseDuration();
        let baseInterval = this.getPrivate("baseInterval");
        if (!$type.isNaN(value)) {
            const firstDay = this._root.locale.firstDayOfWeek;
            const timeUnit = baseInterval.timeUnit;
            const utc = this._root.utc;
            const timezone = this._root.timezone;
            const count = baseInterval.count;
            value = $time.round(new Date(value), timeUnit, count, firstDay, utc, new Date(this.getPrivate("min", 0)), timezone).getTime();
            let duration = $time.getDateIntervalDuration(baseInterval, new Date(value), firstDay, utc, timezone);
            if (timezone) {
                value = $time.round(new Date(value + this.baseDuration() * 0.05), timeUnit, count, firstDay, utc, new Date(this.getPrivate("min", 0)), timezone).getTime();
                duration = $time.getDateIntervalDuration(baseInterval, new Date(value + duration * location), firstDay, utc, timezone);
            }
            return this.valueToPosition(value + duration * location);
        }
        return NaN;
    }
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * NOTE: Unless `adjustPosition` (2nd parameter) is set to `false`, the method
     * will adjust position by `tooltipIntervalOffset`.
     *
     * @param  position        Position
     * @param  adjustPosition  Adjust position
     * @return                 Tooltip text
     */
    getTooltipText(position, adjustPosition) {
        //@todo number formatter + tag
        if (this.getPrivate("min") != null) {
            let format = this.get("tooltipDateFormats")[this.getPrivate("baseInterval").timeUnit];
            let value = this.positionToValue(position);
            if ($type.isNumber(value)) {
                let date = new Date(value);
                let baseInterval = this.getPrivate("baseInterval");
                let duration = $time.getDateIntervalDuration(baseInterval, date, this._root.locale.firstDayOfWeek, this._root.utc, this._root.timezone);
                if (adjustPosition !== false) {
                    date = new Date(value + this.get("tooltipIntervalOffset", -this.get("tooltipLocation", 0.5)) * duration);
                }
                return this._root.dateFormatter.format(date, this.get("tooltipDateFormat", format));
            }
        }
        return "";
    }
    /**
     * Returns a data item from series that is closest to the `position`.
     *
     * @param   series    Series
     * @param   position  Relative position
     * @return            Data item
     */
    getSeriesItem(series, position, location, snap) {
        let fieldName = (this.getPrivate("name") + this.get("renderer").getPrivate("letter"));
        let value = this.positionToValue(position);
        if (location == null) {
            location = 0.5;
        }
        value = value - (location - 0.5) * this.baseDuration();
        const result = $array.getSortedIndex(series.dataItems, (dataItem) => {
            let diValue = 0;
            if (dataItem.open) {
                diValue = dataItem.open[fieldName];
            }
            return $order.compare(diValue, value);
        });
        if (snap || series.get("snapTooltip")) {
            let first = series.dataItems[result.index - 1];
            let second = series.dataItems[result.index];
            if (first && second) {
                if (first.open && second.close) {
                    let open = first.open[fieldName];
                    let close = second.close[fieldName];
                    if (Math.abs(value - open) > Math.abs(value - close)) {
                        return second;
                    }
                }
            }
            if (first) {
                return first;
            }
            if (second) {
                return second;
            }
        }
        else {
            const dataItem = series.dataItems[result.index - 1];
            if (dataItem) {
                if (dataItem.open && dataItem.close) {
                    let open = dataItem.open[fieldName];
                    let close = dataItem.close[fieldName];
                    if (value >= open && value <= close) {
                        return dataItem;
                    }
                }
            }
        }
    }
    /**
     * @ignore
     */
    shouldGap(dataItem, nextItem, autoGapCount, fieldName) {
        const value1 = dataItem.get(fieldName);
        const value2 = nextItem.get(fieldName);
        if (value2 - value1 > this.baseDuration() * autoGapCount) {
            return true;
        }
        return false;
    }
    /**
     * Zooms the axis to specific `start` and `end` dates.
     *
     * Optional `duration` specifies duration of zoom animation in milliseconds.
     *
     * @param  start     Start Date
     * @param  end       End Date
     * @param  duration  Duration in milliseconds
     */
    zoomToDates(start, end, duration) {
        this.zoomToValues(start.getTime(), end.getTime(), duration);
    }
    /**
     * Returns a `Date` object corresponding to specific position within plot
     * area.
     *
     * @param   position  Pposition
     * @return            Date
     */
    positionToDate(position) {
        return new Date(this.positionToValue(position));
    }
    /**
     * Returns a relative position within plot area that corresponds to specific
     * date.
     *
     * @param   date  Date
     * @return        Position
     */
    dateToPosition(date) {
        return this.valueToPosition(date.getTime());
    }
    /**
     * Returns relative position between two grid lines of the axis.
     *
     * @since 5.2.30
     * @return Position
     */
    getCellWidthPosition() {
        let max = this.getPrivate("selectionMax", this.getPrivate("max"));
        let min = this.getPrivate("selectionMin", this.getPrivate("min"));
        if ($type.isNumber(max) && $type.isNumber(min)) {
            return this._intervalDuration / (max - min);
        }
        return 0.05;
    }
}
Object.defineProperty(DateAxis, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DateAxis"
});
Object.defineProperty(DateAxis, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ValueAxis.classNames.concat([DateAxis.className])
});
//# sourceMappingURL=DateAxis.js.map
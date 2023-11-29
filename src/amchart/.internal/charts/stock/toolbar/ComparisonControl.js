import { DropdownListControl } from "./DropdownListControl";
import { StockIcons } from "./StockIcons";
/**
 * A control that is used to change type of the main series of the [[StockChart]].
 */
export class ComparisonControl extends DropdownListControl {
    _getDefaultIcon() {
        return StockIcons.getIcon("Comparison");
    }
}
Object.defineProperty(ComparisonControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ComparisonControl"
});
Object.defineProperty(ComparisonControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DropdownListControl.classNames.concat([ComparisonControl.className])
});
//# sourceMappingURL=ComparisonControl.js.map
import { Container, IContainerSettings, IContainerPrivate, IContainerEvents } from "../../core/render/Container";
export interface IChartSettings extends IContainerSettings {
}
export interface IChartPrivate extends IContainerPrivate {
}
export interface IChartEvents extends IContainerEvents {
}
/**
 * A base class for all charts.
 */
export declare abstract class Chart extends Container {
    static className: string;
    static classNames: Array<string>;
    _settings: IChartSettings;
    _privateSettings: IChartPrivate;
    _events: IChartEvents;
    /**
     * A [[Container]] chart places its elements in.
     *
     * @default Container.new()
     */
    readonly chartContainer: Container;
    /**
     * A [[Container]] chart places its bullets in.
     *
     * @default Container.new()
     */
    readonly bulletsContainer: Container;
}
//# sourceMappingURL=Chart.d.ts.map
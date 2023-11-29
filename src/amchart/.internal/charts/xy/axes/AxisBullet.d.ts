import { Entity, IEntitySettings, IEntityPrivate } from "../../../core/util/Entity";
import type { Sprite } from "../../../core/render/Sprite";
import type { Axis } from "./Axis";
import type { AxisRenderer } from "./AxisRenderer";
export interface IAxisBulletSettings extends IEntitySettings {
    /**
     * Relative location of the bullet within the cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     */
    location?: number;
    /**
     * A visual element of the bullet.
     */
    sprite: Sprite;
    /**
     * Indicates if the bullet should be stacked on top of another bullet if it's
     * on the same position.
     *
     * Will work on horizontal or vertical axes only.
     *
     * @since 5.2.28
     * @default false
     */
    stacked?: boolean;
}
export interface IAxisBulletPrivate extends IEntityPrivate {
}
/**
 * Draws a bullet on an axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_bullets} for more info
 */
export declare class AxisBullet extends Entity {
    /**
     * Target axis object.
     */
    axis: Axis<AxisRenderer> | undefined;
    _settings: IAxisBulletSettings;
    _privateSettings: IAxisBulletPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    dispose(): void;
}
//# sourceMappingURL=AxisBullet.d.ts.map
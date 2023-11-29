interface ParsedDate {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    weekday: number;
}
export declare class Timezone {
    private _utc;
    private _dtf;
    readonly name: string | undefined;
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   timezone  IANA timezone
     * @return            Instantiated object
     */
    static new<C extends typeof Timezone, T extends InstanceType<C>>(this: C, timezone: string | undefined): T;
    constructor(timezone: string | undefined, isReal: boolean);
    convertLocal(date: Date): Date;
    offsetUTC(date: Date): number;
    parseDate(date: Date): ParsedDate;
}
export {};
//# sourceMappingURL=Timezone.d.ts.map
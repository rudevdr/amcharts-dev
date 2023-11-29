/** @ignore */ /** */
/**
 * @ignore
 */
interface Test {
    name: string;
    fn: () => boolean;
}
/**
 * @ignore
 */
export declare class Benchmark {
    protected tests: Array<Test>;
    test(name: string, fn: () => boolean): void;
    run(): void;
}
export {};
//# sourceMappingURL=Benchmark.d.ts.map
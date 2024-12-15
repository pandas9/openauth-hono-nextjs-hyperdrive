export interface DynamoStorageOptions {
    table: string;
    pk?: string;
    sk?: string;
}
export declare function DynamoStorage(options: DynamoStorageOptions): {
    get(key: string[]): Promise<any>;
    set(key: string[], value: any, expiry?: Date): Promise<void>;
    remove(key: string[]): Promise<void>;
    scan(prefix: string[]): AsyncGenerator<[any[], any], void, any>;
};
//# sourceMappingURL=dynamo.d.ts.map
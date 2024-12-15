export interface StorageAdapter {
    get(key: string[]): Promise<Record<string, any> | undefined>;
    remove(key: string[]): Promise<void>;
    set(key: string[], value: any, expiry?: Date): Promise<void>;
    scan(prefix: string[]): AsyncIterable<[string[], any]>;
}
export declare function joinKey(key: string[]): string;
export declare function splitKey(key: string): string[];
export declare namespace Storage {
    function get<T>(adapter: StorageAdapter, key: string[]): Promise<T | null>;
    function set(adapter: StorageAdapter, key: string[], value: any, ttl?: number): Promise<void>;
    function remove(adapter: StorageAdapter, key: string[]): Promise<void>;
    function scan<T>(adapter: StorageAdapter, key: string[]): AsyncIterable<[string[], T]>;
}
//# sourceMappingURL=storage.d.ts.map
import { InferInput } from "valibot";
export declare const subjects: {
    user: import("valibot").ObjectSchema<{
        readonly userID: import("valibot").NumberSchema<undefined>;
        readonly email: import("valibot").StringSchema<undefined>;
    }, undefined>;
};
export type User = InferInput<typeof subjects.user>;
//# sourceMappingURL=subjects.d.ts.map
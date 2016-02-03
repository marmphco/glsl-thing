export function assert(assertion: boolean) {
    if (!assertion) {
        throw new Error("Assertion Failure");
    }
}

export function assertHasValue(value: any) {
    if (value == null || value == undefined) {
        throw new Error("Assertion Failure");
    }
}
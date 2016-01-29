import ValueSink = require("./ValueSink");
import ValueSource = require("./ValueSource");

class InputPort<T> implements ValueSink<T> {
    private _provider: ValueSource<T>;
    private _owner: ValueSink<T>;

    constructor(owner: ValueSink<T>) {
        this._owner = owner;
    }

    setProvider(provider: ValueSource<T>) {
        this._provider = provider;
    }

    pushValue(value: T) {
        this._owner.pushValue(value);
    }

    value(): T {
        if (this._provider) {
            return this._provider.value();
        } else {
            return null;
        }
    }
}

export = InputPort;

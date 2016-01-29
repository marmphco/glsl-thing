import ValueSink = require('./ValueSink');
import ValueSource = require("./ValueSource");

class OutputPort<T> implements ValueSource<T> {
    private _sinks: ValueSink<T>[];
    private _value: T;

    constructor() {
        this._sinks = [];
    }

    addSink(consumer: ValueSink<T>) {
        this._sinks.push(consumer);
    }

    setValue(value: T) {
        this._value = value;

        this._sinks.forEach((sink) => {
            sink.pushValue(value);
        });
    }

    value(): T {
        return this._value;
    }
};

export = OutputPort;
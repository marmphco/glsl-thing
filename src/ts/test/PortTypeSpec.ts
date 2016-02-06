/// <reference path="../typings/jasmine/jasmine.d.ts" />

import {BaseType, ArrayType, AttributeType, typesAreCompatible} from "../lib/PortType";

describe("PortType", function() {
    it("can map basetypes to string names", () => {
        expect(BaseType[BaseType.Float]).toEqual("Float");
        expect(BaseType[BaseType.ShaderProgram]).toEqual("ShaderProgram");
    });

    it("can check type compatibility", () => {
        const boolScalar = BaseType.Boolean;
        const boolVector = BaseType.BooleanVector3;

        const floatScalar = BaseType.Float;
        const floatVector = BaseType.FloatVector2;
        const floatMatrix = BaseType.FloatMatrix4;
        const floatAttribute = new AttributeType(BaseType.Float);
        const floatArray = new ArrayType(BaseType.Float, 2);

        const otherFloatScalar = BaseType.Float;

        expect(typesAreCompatible(boolScalar, boolScalar)).toBeTruthy();
        expect(typesAreCompatible(otherFloatScalar, floatScalar)).toBeTruthy();

        expect(typesAreCompatible(boolScalar, boolVector)).toBeFalsy();
        expect(typesAreCompatible(boolScalar, floatScalar)).toBeFalsy();
        expect(typesAreCompatible(boolVector, floatVector)).toBeFalsy();
        expect(typesAreCompatible(floatVector, floatMatrix)).toBeFalsy();
        expect(typesAreCompatible(floatVector, floatArray)).toBeFalsy();
        expect(typesAreCompatible(floatVector, floatAttribute)).toBeFalsy();
    });

    it("can be converted from GL types", () => {
        fail("needs dom to test");
    })
});
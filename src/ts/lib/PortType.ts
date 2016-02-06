export enum BaseType {
    Boolean,
    BooleanVector2,
    BooleanVector3,
    BooleanVector4,
    BooleanMatrix2,
    BooleanMatrix3,
    BooleanMatrix4,

    Integer,
    IntegerVector2,
    IntegerVector3,
    IntegerVector4,
    IntegerMatrix2,
    IntegerMatrix3,
    IntegerMatrix4,

    Unsigned,
    UnsignedVector2,
    UnsignedVector3,
    UnsignedVector4,
    UnsignedMatrix2,
    UnsignedMatrix3,
    UnsignedMatrix4,

    Float,
    FloatVector2,
    FloatVector3,
    FloatVector4,
    FloatMatrix2,
    FloatMatrix3,
    FloatMatrix4,

    String,
    Mesh,

    VertexShader,
    FragmentShader,
    ShaderProgram,
}

export class ArrayType {
    type: BaseType;
    size: number;

    constructor(type: BaseType, size: number) {
        this.type = type;
        this.size = size;
    }
}

export class AttributeType {
    type: BaseType;

    constructor(type: BaseType) {
        this.type = type;
    }
}

export type PortType = BaseType | ArrayType | AttributeType;

export function portTypeFromGLType(gl: WebGLRenderingContext, type: number): PortType {
    switch(type) {
        case gl.FLOAT:
            return BaseType.Float;
        default:
            return null;
    }
}

export function typesAreCompatible(t: PortType, u: PortType): boolean {
    if (t instanceof ArrayType && u instanceof ArrayType) {
        return t.size == u.size && t.type == u.type;
    }
    else if (t instanceof AttributeType && u instanceof AttributeType) {
        return t.type == u.type;
    }
    else {
        return t === u;
    }
}

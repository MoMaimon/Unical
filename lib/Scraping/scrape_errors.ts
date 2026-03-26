class InvalidRequest extends Error {
    constructor(message : string){
        super(message)
    }
}

class ParamsInvalid extends InvalidRequest {
    constructor(){
        super("\"ParamCount\" doeasnt equal passed params length")
    }
}

class ParamsCountInvalid extends InvalidRequest {
    constructor(){
        super("\"ParamCount\" is invalid")
    }
}

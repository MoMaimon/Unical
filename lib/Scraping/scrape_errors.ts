class InvalidRequest extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ParamsInvalid extends InvalidRequest {
  constructor() {
    super('"ParamCount" does\'nt equal passed params length');
  }
}

class ParamsCountInvalid extends InvalidRequest {
  constructor() {
    super('"ParamCount" is invalid');
  }
}

class InvalidConfiguration extends InvalidRequest {
  constructor() {
    super("Unhandled params configuration: Unable to create bulk operations.");
  }
}

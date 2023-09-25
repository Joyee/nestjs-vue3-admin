const { nanoid } = require('nanoid');

export class UtilService {
  constructor() {}

  public genterateUUID(): string {
    return nanoid();
  }
}

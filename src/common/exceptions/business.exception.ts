import { HttpException } from '@nestjs/common';
import { ErrorCodeMap, ErrorCodeMapType } from '../constants/business.codes';

/**
 * 业务异常时均使用该异常
 */
export class BusinessException extends HttpException {
  /**
   * 业务错误代码，非http code
   */
  private errorCode: ErrorCodeMapType;

  constructor(errorCode: ErrorCodeMapType) {
    super(ErrorCodeMap[errorCode], 200);
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCodeMapType {
    return this.errorCode;
  }
}

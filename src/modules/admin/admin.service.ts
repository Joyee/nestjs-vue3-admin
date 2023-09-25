import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class AdminService {
  constructor(private logger: LoggerService) {}

  findAll() {}
}

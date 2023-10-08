import { SystemModule } from './../system/system.module';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { LoginModule } from '../login/login.module';

@Module({
  imports: [SystemModule, LoginModule],
  controllers: [AccountController]
})
export class AccountModule {}

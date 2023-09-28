import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [SystemModule],
  providers: [LoginService],
  exports: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}

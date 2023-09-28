import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { LoginModule } from './login/login.module';
import { SystemModule } from './system/system.module';
import { ADMIN_PREFIX } from './admin.constants';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        children: [{ path: 'system', module: SystemModule }],
      },
      { path: ADMIN_PREFIX, module: LoginModule },
    ]),
    LoginModule,
    SystemModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

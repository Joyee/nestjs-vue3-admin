import { Module } from '@nestjs/common';
import { RouterModule, APP_GUARD } from '@nestjs/core';
import { LoginModule } from './login/login.module';
import { SystemModule } from './system/system.module';
import { ADMIN_PREFIX } from './admin.constants';
import { AccountModule } from './account/account.module';
import { AuthGuard } from './core/guards/auth.guard';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        children: [
          { path: 'sys', module: SystemModule },
          { path: 'account', module: AccountModule },
        ],
      },
      { path: ADMIN_PREFIX, module: LoginModule },
    ]),
    LoginModule,
    SystemModule,
    AccountModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [SystemModule],
})
export class AdminModule {}

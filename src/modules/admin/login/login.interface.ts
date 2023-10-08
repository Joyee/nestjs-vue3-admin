import SysMenu from '@/entities/admin/sys-menu.entity';
import { ApiProperty } from '@nestjs/swagger';
export class ImageCaptcha {
  @ApiProperty({ description: 'base64格式的svg图片' })
  img: string;

  @ApiProperty({ description: '验证码对应的唯一id' })
  id: string;
}

export class LoginToken {
  @ApiProperty({ description: 'JWT身份token' })
  token: string;
}

export class PermissionMenuInfo {
  @ApiProperty({ description: '菜单列表', type: [SysMenu] })
  menus: SysMenu[];

  @ApiProperty({ description: '权限列表', type: [String] })
  perms: string[];
}

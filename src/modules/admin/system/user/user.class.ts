import { ApiProperty } from '@nestjs/swagger';

export class AccountInfo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  headImg: string;

  @ApiProperty()
  loginIp: string;
}

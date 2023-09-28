import { Controller, Post, Body, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./role.dto";

@ApiTags("角色模块")
@Controller("role")
export class RoleController {
  constructor(private roleService: RoleService) {
  }

  @ApiOperation({ summary: "添加角色" })
  @Post("add")
  async add(@Body() dto: CreateRoleDto) {

  }
}

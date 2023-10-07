import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './../../admin.constants';

/**
 * 为了允许某些接口不需要提供令牌，我们可以使用装饰器 @Public 标记这些接口
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

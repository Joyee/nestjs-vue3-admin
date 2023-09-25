import { SetMetadata } from '@nestjs/common';
import { TRANSFORM_KEEP_KEY_METADATA } from '../constants/decorator.constants';

/**
 * 不转化成JSON结构，保留原始返回数据
 */
export const Keep = () => SetMetadata(TRANSFORM_KEEP_KEY_METADATA, true);

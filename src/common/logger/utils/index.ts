import * as path from 'path';
import { existsSync } from 'node:fs';
/**
 * 获取应用根目录
 */
export const getAppRootPath = (): string => {
  if (process.env.APP_ROOT_PATH) {
    return path.resolve(process.env.APP_ROOT_PATH);
  }
  // 逐级查找 node_modules 目录
  let cur = __dirname;
  const root = path.parse(cur).root;

  let appRootPath = '';
  while (cur) {
    if (
      existsSync(path.join(cur, 'node_modules')) &&
      existsSync(path.join(cur, 'package.json'))
    ) {
      appRootPath = cur;
    }
    // 已经为根路径了，无需继续往上查找
    if (root === cur) {
      break;
    }
    // 继续向上查找
    cur = path.resolve(cur, '..');
  }

  if (appRootPath) {
    process.env.APP_ROOT_PATH = appRootPath;
  }

  return appRootPath;
};

import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';

const getEnv = () => process.env.NODE_ENV;

export const getConfig = (type?: string) => {
  const env = getEnv();
  const yamlPath = path.join(process.cwd(), `config/.${env}.yaml`);
  const config = parse(fs.readFileSync(yamlPath, 'utf8'));
  if (type) return config[type];
  return config;
};

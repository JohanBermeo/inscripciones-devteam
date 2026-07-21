import { createHash } from 'node:crypto';
import { env } from '../env';

export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(ip + env.IP_HASH_SALT)
    .digest('hex');
}

export function hashUserAgent(ua: string): string {
  return createHash('sha256')
    .update(ua + env.IP_HASH_SALT)
    .digest('hex');
}

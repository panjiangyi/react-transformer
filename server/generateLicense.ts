import * as crypto from 'crypto'
import 'dotenv/config'
const LICENSE_SECRET = process.env.LICENSE_SECRET
if (!LICENSE_SECRET) {
  throw new Error('LICENSE_SECRET 环境变量未设置')
}

/**
 * 根据机器码生成注册码（只在开发者本地使用）
 * @param machineId 机器码
 * @returns 注册码
 */
export function generateLicense(machineId: string): string {
  return crypto
    .createHash('sha256')
    .update(machineId + LICENSE_SECRET)
    .digest('hex')
}

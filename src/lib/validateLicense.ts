import * as crypto from 'crypto'

const LICENSE_SECRET = process.env.LICENSE_SECRET
if (!LICENSE_SECRET) {
  throw new Error('LICENSE_SECRET 环境变量未设置')
}

/**
 * 校验注册码是否有效
 * @param machineId 机器码
 * @param licenseCode 用户输入的注册码
 * @returns 是否有效
 */
export function validateLicense(machineId: string, licenseCode: string): boolean {
  const expected = crypto
    .createHash('sha256')
    .update(machineId + LICENSE_SECRET)
    .digest('hex')
  return licenseCode === expected
}

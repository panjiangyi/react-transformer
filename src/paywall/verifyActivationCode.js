// verifyActivationCode.js
import NodeRSA from 'node-rsa'
import crypto from 'crypto'
import getMachineCode from './machineId.js'
import { publicKeyString } from '../../publicKey.js'

// 客户端嵌入的公钥
const publicKey = new NodeRSA(publicKeyString)

// 验证激活码
function verifyActivationCode(activationCode) {
  try {
    const decoded = Buffer.from(activationCode, 'base64').toString('utf8')
    const [dataString, signature] = decoded.split('|')

    // 1. 验证签名
    const isValid = publicKey.verify(dataString, signature, 'utf8', 'base64')
    if (!isValid) throw new Error('签名无效')

    // 2. 解析数据
    const data = JSON.parse(dataString)

    // 3. 检查机器码是否匹配
    const currentMachineCode = getMachineCode()
    if (data.machineCode !== currentMachineCode) {
      throw new Error('机器码不匹配')
    }

    // 4. 检查硬件指纹（可选）
    const expectedHwId = crypto
      .createHash('sha256')
      .update(data.machineCode + data.salt)
      .digest('hex')
    if (data.hwId !== expectedHwId) {
      throw new Error('硬件ID无效')
    }

    // 5. 检查时间戳（防重放，示例有效期30天）
    const expiryTime = 30 * 24 * 60 * 60 * 1000 // 30天
    if (Date.now() - data.timestamp > expiryTime) {
      throw new Error('激活码已过期')
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export default verifyActivationCode

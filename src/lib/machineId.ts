import * as os from 'os'
import * as crypto from 'crypto'
const key = 'sdfasdfsd231312'

/**
 * 获取本机唯一机器码
 * 可用于注册码绑定
 */
export function getMachineId(): string {
  const cpuInfo = os.cpus()[0]?.model || ''
  const hostname = os.hostname()
  const platform = os.platform()
  const arch = os.arch()
  // 你可以根据需要添加更多硬件信息
  const raw = `${cpuInfo}-${hostname}-${platform}-${arch}`
  return crypto
    .createHash('sha256')
    .update(raw + key)
    .digest('hex')
}

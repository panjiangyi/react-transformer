import crypto from 'crypto'
import macaddress from 'macaddress'
import { execSync } from 'child_process'
// 获取机器码（CPU序列号 + 硬盘ID + MAC地址）
async function getMachineCode() {
  // 获取 MAC 地址
  let mac = '00:00:00:00:00:00'
  try {
    mac = (await macaddress.one()) || mac
  } catch (e) {
    console.log(e)
  }

  // 获取 CPU 序列号
  let cpuSerial = 'unknown'
  try {
    if (process.platform === 'linux') {
      cpuSerial =
        execSync("cat /proc/cpuinfo | grep Serial | awk '{print $NF}'", { encoding: 'utf8' }).trim().split('\n')[0] ||
        'unknown'
    } else if (process.platform === 'win32') {
      cpuSerial = execSync('wmic cpu get ProcessorId', { encoding: 'utf8' }).split('\n')[1]?.trim() || 'unknown'
    } else if (process.platform === 'darwin') {
      cpuSerial =
        execSync('system_profiler SPHardwareDataType | grep "Serial Number" | awk \'{print $NF}\'', {
          encoding: 'utf8',
        }).trim() || 'unknown'
    }
  } catch (e) {
    console.log(e)
  }

  // 获取硬盘ID
  let diskId = 'unknown'
  try {
    if (process.platform === 'linux') {
      diskId = execSync('lsblk -d -n -o serial', { encoding: 'utf8' }).trim().split('\n')[0] || 'unknown'
    } else if (process.platform === 'win32') {
      diskId = execSync('wmic diskdrive get SerialNumber', { encoding: 'utf8' }).split('\n')[1]?.trim() || 'unknown'
    } else if (process.platform === 'darwin') {
      diskId =
        execSync('system_profiler SPSerialATADataType | grep "Serial Number" | awk \'{print $NF}\'', {
          encoding: 'utf8',
        })
          .trim()
          .split('\n')[0] || 'unknown'
    }
  } catch (e) {
    console.log(e)
  }

  const raw = `${cpuSerial}|${diskId}|${mac}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}

export default getMachineCode

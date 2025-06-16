import express, { Request, Response } from 'express'
import cors from 'cors'
import { generateLicense } from './generateLicense'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express server is running!')
})

// 生成注册码
app.post('/generate-license', (req, res) => {
  const { machineId } = req.body
  if (!machineId) {
    return res.status(400).json({ error: 'machineId is required' })
  }
  try {
    const license = generateLicense(machineId)
    res.json({ license })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

// 校验注册码
app.post('/verify-license', (req, res) => {
  const { machineId, license } = req.body
  if (!machineId || !license) {
    return res.status(400).json({ error: 'machineId and license are required' })
  }
  try {
    const valid = generateLicense(machineId) === license
    res.json({ valid })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

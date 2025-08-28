// Runs backend (app.mjs) and frontend (Vite) together without relying on npm scripts
// Works even if path contains special characters like '&'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function run(name, command, args, options = {}) {
  const child = spawn(command, args, { stdio: 'inherit', ...options })
  child.on('exit', (code) => {
    console.log(`[${name}] exited with code ${code}`)
    process.exit(code ?? 0)
  })
  return child
}

// 1) Backend
const backend = run('backend', process.execPath, [path.join(__dirname, 'app.mjs')], {
  env: { ...process.env },
})

// 2) Frontend (Vite) at port 3000
const clientDir = path.join(__dirname, 'client')
const viteBin = path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js')
const frontend = run('frontend', process.execPath, [viteBin, '--port', '3000'], {
  cwd: clientDir,
  env: { ...process.env },
})

process.on('SIGINT', () => {
  backend.kill('SIGINT')
  frontend.kill('SIGINT')
  process.exit(0)
})



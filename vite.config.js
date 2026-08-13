import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'
import unlockHandler from './api/unlock.js'

function localUnlockApi(mode) {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    name: 'local-unlock-api',
    configureServer(server) {
      server.middlewares.use('/api/unlock', async (request, response) => {
        process.env.SITE_ACCESS_SECRET ||= env.SITE_ACCESS_SECRET
        process.env.ACCESS_CODE_PREFIX ||= env.ACCESS_CODE_PREFIX

        let rawBody = ''
        for await (const chunk of request) rawBody += chunk
        try {
          request.body = rawBody ? JSON.parse(rawBody) : undefined
        } catch {
          request.body = undefined
        }

        response.status = (statusCode) => {
          response.statusCode = statusCode
          return response
        }
        response.json = (value) => {
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(JSON.stringify(value))
        }

        unlockHandler(request, response)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), localUnlockApi(mode)],
}))

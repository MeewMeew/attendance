import { mkdir } from 'node:fs/promises'

const USER_NAME = 'meewmeew'
const REPO_NAME = 'attendance-project'
const repoAPI = 'https://api.github.com/repos/' + USER_NAME + '/' + REPO_NAME + '/releases/latest'

try {
  const response = await fetch(repoAPI)
  const data = await response.json()
  const assets = data.assets
  const clientURL = assets.find((asset: any) => asset.name === 'client.zip').browser_download_url
  const serverURL = assets.find((asset: any) => asset.name === 'server.zip').browser_download_url
  await mkdir('temp')
  await Bun.write('temp/client.zip', await fetch(clientURL))
  await Bun.write('temp/server.zip', await fetch(serverURL))
} catch (error) {
}
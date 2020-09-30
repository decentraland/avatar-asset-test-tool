import { readdirSync, readFile as readFileOrig } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import { getFileCID } from '../cid/getFileCID'
import { readAssetJson } from './readAssetJson'

const readFile = promisify(readFileOrig)

export async function getContents(folderFullPath: string) {
  const filenames = readdirSync(folderFullPath)

  const originalJson = readAssetJson(folderFullPath)
  const imageName = `${originalJson.id}.png`
  const nameBlacklist = ['asset.json', 'thumbnail.png', imageName]

  return Promise.all(
    filenames.filter(filename => !nameBlacklist.includes(filename)).map(async fileName => {
      const filePath = join(folderFullPath, fileName)
      const fileContent = await readFile(filePath)

      return {
        file: fileName,
        hash: await getFileCID(fileContent)
      }
    })
  )
}

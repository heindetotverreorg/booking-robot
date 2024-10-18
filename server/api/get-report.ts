import { promises as fs } from 'fs';

const filePath = 'server/screenshots/error.png'

export default defineEventHandler(async () => {
    async function readFile() {
        try {
            return await fs.readFile(filePath, 'base64');
        } catch (e) {
            console.error(e);
        }
    }

    return await readFile()
})

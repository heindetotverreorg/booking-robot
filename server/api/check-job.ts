import { job } from '@/server/cron/job.js'

export default defineEventHandler(async (event) => {
    if (job) {
        return `job information: ${job}`
    }

    return 'no job running'
})
import { job, jobStatus } from '@/server/cron/job.js'

export default defineEventHandler(async (event) => {
    if (job && jobStatus) {
        return jobStatus
    }

    return 'no job running'
})
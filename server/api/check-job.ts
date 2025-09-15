import { job, jobStatus } from '@/server/cron/job.js'

export default defineEventHandler(async (event) => {
    if (job && jobStatus) {
        console.log('returning job status: ', jobStatus)
        return jobStatus
    }

    return 'no job running'
})
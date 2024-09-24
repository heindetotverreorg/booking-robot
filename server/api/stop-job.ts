import { job, stopJob } from '@/server/cron/job.js'

export default defineEventHandler(async () => {
    if (job) {
        stopJob()
        
        return 'job stopped'
    }

    return 'no job running'
})
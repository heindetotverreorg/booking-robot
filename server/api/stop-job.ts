import initJob from '@/server/cron/job.js'

export default defineEventHandler(async (event) => {
    const job = initJob({ get: true })

    if (job) {
        initJob({ stop: true })

        return 'job stopped'
    }

    return 'no job running'
})
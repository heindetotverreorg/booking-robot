import initJob from '@/server/cron/job.js'

export default defineEventHandler(async (event) => {
    const job = initJob({ get: true })

    if (job) {
        return `job information: ${JSON.stringify(job)}`
    }

    return 'no job running'
})
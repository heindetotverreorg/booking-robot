import { schedule, type ScheduledTask } from 'node-cron';

let job : ScheduledTask | null
let jobStatus : string

const setJob = ({
    set
} : {
    set?: { callBack: () => void, expression: string }
}) : ScheduledTask | null => {
    if (set) {
        job = schedule(set.expression, set.callBack, {
            scheduled: true,
            timezone: "UTC"
        });
    }
    return job
}

const stopJob = () => {
    if (job) {
        job.stop()
        job = null
    }
}

const setJobStatus = (status: string) => {
    jobStatus = status
}

export {
    job,
    jobStatus,
    setJobStatus,
    setJob,
    stopJob,
}
import { schedule, type ScheduledTask } from 'node-cron';
import dayjs from 'dayjs';

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
        console.log('-- job stopped at', dayjs().format('YYYY-MM-DD HH:mm:ss'));
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
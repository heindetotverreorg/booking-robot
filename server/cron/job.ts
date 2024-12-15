import { schedule, type ScheduledTask } from 'node-cron';
import moment from 'moment-timezone';

let job : ScheduledTask | null
let jobStatus : string

const setJob = ({
    set
} : {
    set?: { callBack: () => void, expression: string }
}) : ScheduledTask | null => {
    console.log('<=== setJob ===>')
    if (set) {
        console.log('job set at', moment());
        console.log('expression:', set.expression);
        job = schedule(set.expression, set.callBack, {
            scheduled: true,
            timezone: "UTC"
        });
    }
    return job
}

const stopJob = () => {
    if (job) {
        console.log('job stopped at', moment());
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
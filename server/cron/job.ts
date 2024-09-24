import type { ScheduledTask } from 'node-cron';

var job : ScheduledTask

const initJob = ({ get, stop } : { get?: boolean, stop?: boolean }) : ScheduledTask | void => {
    if (get) {
        return job
    }
    if (stop) {
        return job.stop()
    }
    return job
}

export default initJob
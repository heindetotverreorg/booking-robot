import { schedule, type ScheduledTask } from 'node-cron';
import dayjs, { Dayjs } from 'dayjs';
import { config } from '@/server/config';
import { createWeeklyRepeatingCronExpression } from '@/server/utils/time';

let job : ScheduledTask | null
let jobStatus : string

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const getJobStartInfo = (jobStartDayjs : Dayjs) => {
    const { isWeeklyRepeatedFlow, repeatValue } = config;

    if (isWeeklyRepeatedFlow) {
        return `${repeatValue} ${weekdays[jobStartDayjs.day()]}: ${jobStartDayjs.hour()}:${jobStartDayjs.minute()}`
    }

    return jobStartDayjs 
}

const getJobStatusInfo = (selectedDateString : string) => {
    const { isWeeklyRepeatedFlow, repeatValue } = config;

    const selectedDate = dayjs(selectedDateString);

    if (isWeeklyRepeatedFlow) {
        return `${repeatValue}. Eerst volgende boeking aanstaande ${weekdays[selectedDate.day()]}`
    }

    return selectedDate
}

const scheduleJob = ({
    jobRunMoment,
    callBack
} : {
    jobRunMoment: Dayjs,
    callBack : () => void
}) => {
    const cronExpression = !config.customCronString
        ? `${jobRunMoment.minute()} ${jobRunMoment.hour()} ${jobRunMoment.date()} ${jobRunMoment.month() + 1} *`
        : config.customCronString;
    const recurringCronExpression = createWeeklyRepeatingCronExpression(jobRunMoment);

    if (config.isWeeklyRepeatedFlow) {
        console.log('-- set recurring job with expression: ', recurringCronExpression)
        setJob({ set: { callBack, expression: recurringCronExpression } });
        return;
    }

    console.log('-- set single job with expression: ', cronExpression)
    setJob({ set: { callBack, expression: cronExpression } });
};

const setJob = ({
    set
} : {
    set?: { callBack: () => void, expression: string }
}) : ScheduledTask | null => {
    if (set) {
        job = schedule(set.expression, set.callBack, {
            scheduled: true,
            timezone: 'Europe/Amsterdam'
        });
    }
    return job
}

const setJobStatus = (status: string) => {
    jobStatus = status
}

const stopJob = () => {
    if (job) {
        console.log('-- job stopped at', dayjs().format('YYYY-MM-DD HH:mm:ss'));
        job.stop()
        job = null
    }
}

export {
    getJobStartInfo,
    getJobStatusInfo,
    job,
    jobStatus,
    scheduleJob,
    setJobStatus,
    setJob,
    stopJob,
}
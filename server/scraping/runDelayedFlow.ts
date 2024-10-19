import moment from 'moment-timezone';
import type { Flow, Action } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';

export const runDelayedFlow = async (
    flow : Flow, 
    payload : Record<string, Action>,
    bookingThreshold: number
) => {
    const { value : bookingDate } = payload.dateSelect;
    const { value : timeCourtSelect } = payload.timeCourtSelect;
    let jobStartDate : moment.Moment;

    console.log('NOW momentjs', moment().tz('Europe/Amsterdam'));

    jobStartDate = moment(`${bookingDate}T00:00:00.000Z`)
        .subtract(bookingThreshold, 'day')
        .tz('Europe/Amsterdam');

    const [time, court] = timeCourtSelect as string[];

    if (job) {
        console.log('flow stopped at', moment().toLocaleString());
        stopJob()
    }

    if (config.cronTestTime) {
        const [hours, minutes] = config.cronTestTime.split(':')
        jobStartDate = moment(bookingDate).set({ hours: parseInt(hours), minutes: parseInt(minutes) })
    }

    scheduleJob(jobStartDate, async () => {
        console.log('flow executed at', moment().toLocaleString());
        await runFlow(flow, payload);
        stopJob()
    });

    const message = `flow will run at ${jobStartDate.toLocaleString()} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = (date: moment.Moment, runFlow: () => void) => {
    const timeZoneOffset = date.utcOffset() / 60;
    const cronExpression = process.env.NODE_ENV === 'development' 
        ? `${date.minute()} ${date.hour() - timeZoneOffset} ${date.date()} ${date.month() + 1} *`
        : `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`
    console.log('env', process.env.NODE_ENV);
    console.log('cron expression', cronExpression);
    setJob({ set: { callBack: runFlow, expression: cronExpression } });
};

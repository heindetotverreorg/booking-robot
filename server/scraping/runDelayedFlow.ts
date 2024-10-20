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
    const timeZoneOffset = moment().tz('Europe/Amsterdam').utcOffset() / 60;
    const [time, court] = timeCourtSelect as string[];

    let jobStartDate : moment.Moment;

    jobStartDate = moment(bookingDate)
        .set({ hours: 0 - timeZoneOffset, minutes: 0 })
        .subtract(bookingThreshold, 'day');

    if (job) {
        stopJob()
    }

    if (config.cronTestTime) {
        const [hours, minutes] = config.cronTestTime.split(':')
        jobStartDate = moment(bookingDate).set({ hours: parseInt(hours) - timeZoneOffset, minutes: parseInt(minutes) })
    }

    scheduleJob(jobStartDate, async () => {
        await runFlow(flow, payload);
        stopJob()
    });

    const message = `job will run at ${jobStartDate} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = (date: moment.Moment, runFlow: () => void) => {
    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`
    setJob({ set: { callBack: runFlow, expression: cronExpression } });
};

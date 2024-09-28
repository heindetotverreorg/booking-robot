import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js';
import type { Flow, Action } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';

export const runDelayedFlow = async (
    flow : Flow, 
    payload : Record<string, Action>,
    bookingThreshold: number
) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const assumedTimezone = dayjs.tz.guess()
    dayjs.tz.setDefault(assumedTimezone);

    const { value : bookingDate } = payload.dateSelect;
    const { value : timeCourtSelect } = payload.timeCourtSelect;
    let jobStartDate : Dayjs;

    jobStartDate = dayjs(`${bookingDate}T00:00:00.000Z`)
        .subtract(bookingThreshold, 'day')
        .utc()

    const [time, court] = timeCourtSelect as string[];

    if (job) {
        console.log('flow stopped at', new Date());
        stopJob()
    }

    if (config.cronTestTime) {
        jobStartDate = dayjs(`${payload.dateSelect.value}T${config.cronTestTime}:00.000Z`)
            .utc()
    }

    scheduleJob(jobStartDate, async () => {
        await runFlow(flow, payload);
        console.log('flow executed at', new Date());
        stopJob()
    });

    const message = `flow will run at ${jobStartDate.toISOString()} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = (date: Dayjs, runFlow: () => void) => {
    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`;
    console.log('cron expression', cronExpression);
    setJob({ set: { callBack: runFlow, expression: cronExpression } });
};

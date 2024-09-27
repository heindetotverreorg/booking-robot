import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone.js';
import type { Flow, Action } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';
import { job, setJob, stopJob, setJobStatus } from '@/server/cron/job.js'

export const runDelayedFlow = async (
    flow : Flow, 
    payload : Record<string, Action>,
    bookingThreshold: number
) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const assumedTimezone = dayjs.tz.guess()

    const { value : bookingDate } = payload.dateSelect;
    const { value : timeCourtSelect } = payload.timeCourtSelect;

    const jobStartDate = dayjs(`${bookingDate}T00:00:00.000Z`)
        .tz(assumedTimezone)
        .subtract(bookingThreshold, 'day')

    const [time, court] = timeCourtSelect as string[];
    
    const message = `flow will run at ${jobStartDate.toISOString()} at ${payload.dateSelect.value} : ${time} on court ${court}`;
    const status = `${payload.dateSelect.value} : ${time} op baan ${court}`

    if (job) {
        console.log('flow stopped at', new Date());
        stopJob()
    }

    scheduleJob(jobStartDate, async () => {
        await runFlow(flow, payload);
        console.log('flow executed at', new Date());
        stopJob()
    });

    console.log(message)
    setJobStatus(status);

    return message;
}

const scheduleJob = (date: Dayjs, callback: () => void) => {
    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`;
    setJob({ set: { callBack: callback, expression: cronExpression } });
};

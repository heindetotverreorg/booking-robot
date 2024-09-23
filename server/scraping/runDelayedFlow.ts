import dayjs, { Dayjs } from 'dayjs';
import { schedule } from 'node-cron';
import type { ScheduledTask } from 'node-cron';
import type { Flow, Action } from '@/types/flow'
import { runFlow } from '@/server/scraping/runFlow';

let job : ScheduledTask

export const runDelayedFlow = async (
    flow : Flow, 
    payload : Record<string, Action>,
    bookingThreshold: number
) => {
    const { value : bookingDate } = payload.dateSelect;
    const { value : timeCourtSelect } = payload.timeCourtSelect;

    const jobStartDate = dayjs(bookingDate as string).subtract(bookingThreshold - 1, 'day');
    const [time, court] = timeCourtSelect as string[];
    
    const message = `flow will run at ${jobStartDate.toISOString()} at ${payload.dateSelect.value} : ${time} on court ${court}`;

    if (job) {
        console.log('flow stopped at', new Date());
        job.stop();
    }

    scheduleJob(jobStartDate, async () => {
        await runFlow(flow, payload);
        console.log('flow executed at', new Date());
    });

    console.log(message)

    return message;
}

const scheduleJob = (date: Dayjs, callback: () => void) => {
    const cronExpression = `${date.minute()} ${date.hour()} ${date.date()} ${date.month() + 1} *`;
    job = schedule(cronExpression, callback, {
        scheduled: true,
        timezone: "UTC"
    });
};

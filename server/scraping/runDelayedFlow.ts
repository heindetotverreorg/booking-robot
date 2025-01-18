import { type Flow, type Action } from '@/types/flow'
import { runFlow, runLogin } from '@/server/scraping';
import { getJobStartInfo, getJobStatusInfo, job, scheduleJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { config } from '@/server/config';
import { createJobStartMoment, createTestJobStartMoment, createRepeatingFlowPayload } from '@/server/utils/time';

import { Dayjs } from 'dayjs';

export const runDelayedFlow = async (
    flow: Flow, 
    payload: Record<string, Action>,
    bookingThreshold: number
) => {
    const { value: jobRunMoment } = payload.dateSelect;
    const { value: timeCourtSelect } = payload.timeCourtSelect;
    const [time, court] = timeCourtSelect as string[];

    const jobStartDayjs: Dayjs = !config.cronTestTime 
        ? createJobStartMoment(jobRunMoment as string, bookingThreshold)
        : createTestJobStartMoment()

    if (job) {
        stopJob();
    }

    scheduleJob({
        jobRunMoment: jobStartDayjs,
        callBack: async () => {
            if (config.isWeeklyRepeatedFlow) {
                const date = payload.dateSelect.value as string;
                payload.dateSelect.value = createRepeatingFlowPayload({ date }) as string
            }

            await runFlow(flow, payload);

            setJobStatus(`${getJobStatusInfo(payload.dateSelect.value as string)} om ${time} op baan ${court} ${config.isTest ? 'IS A TEST' : ''}`);

            if (!config.isWeeklyRepeatedFlow) {
                stopJob();
            }
        }
    });

    const message = `Job will run at: ${getJobStartInfo(jobStartDayjs)}. Job will execute with booking information: ${payload.dateSelect.value} : ${time} on court ${court}`;

    setJobStatus(`${getJobStatusInfo(payload.dateSelect.value as string)} om ${time} op baan ${court} ${config.isTest ? 'IS A TEST' : ''}`);

    const loginMessage = await runLogin(flow, payload) as string

    return loginMessage.includes('Error in step')
        ? loginMessage
        : message
};
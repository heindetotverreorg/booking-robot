import { type Flow, type Action } from '@/types/flow'
import { runFlow, runValidateInput } from '@/server/scraping';
import { getJobStartInfo, getJobStatusInfo, job, scheduleJob, stopJob, setJobStatus } from '@/server/cron/job.js'
import { setIteration, config } from '@/server/config';
import { createJobStartMoment, createTestJobStartMoment, createRepeatingFlowPayload } from '@/server/utils/time';

import dayjs, { Dayjs } from 'dayjs';

export const runDelayedFlow = async (
    flow: Flow, 
    payload: Record<string, Action>,
    bookingThreshold: number
) => {
    const { value: jobRunMoment } = payload.dateSelect;
    const { value: timeCourtSelect } = payload.timeCourtSelect;
    const [time, court] = timeCourtSelect as string[];

    const inputValidationMessage = await runValidateInput(flow, { ...editPayload(payload) }) as string

    if (inputValidationMessage?.includes('Error in step \'selectPeople\' with action \'{"type":"select","key":"person')) {
        console.log('--- input validation error')
        if (job) {
            stopJob();
        }
        return inputValidationMessage
    }

    const jobStartDayjs: Dayjs = !config.cronTestTime 
        ? createJobStartMoment(jobRunMoment as string, time as string, bookingThreshold)
        : createTestJobStartMoment()

    if (job) {
        stopJob();
    }

    scheduleJob({
        jobRunMoment: jobStartDayjs,
        callBack: async () => {
            const { iteration } = config;
            setIteration(iteration + 1);

            if (config.isWeeklyRepeatedFlow) {
                console.log('-- is weekly repeated flow')
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

    return message
};

const editPayload = (payload: Record<string, Action>) => {
    const payloadToEdit = JSON.parse(JSON.stringify(payload))
    payloadToEdit.dateSelect.value = dayjs().add(1, 'day').format('YYYY-MM-DD')
    payloadToEdit.timeCourtSelect.value = [ '08:00', '7' ]

    return payloadToEdit
}
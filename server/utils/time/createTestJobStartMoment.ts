import dayjs from 'dayjs';
import { config } from '@/server/config';

export default  () => {
    const [hours, minutes] = config.cronTestTime.split(':')

    if (!hours || !minutes) {
        return dayjs()
    }

    return dayjs()
        .set('hour', parseInt(hours))
        .set('minute', parseInt(minutes))
}
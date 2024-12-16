import dayjs from 'dayjs';
import { config } from '@/server/config';

export default  () => {
    const [hours, minutes] = config.cronTestTime.split(':')

    return dayjs()
        .set('hour', parseInt(hours))
        .set('minute', parseInt(minutes))
}
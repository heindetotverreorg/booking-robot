import moment from 'moment-timezone';
import { config } from '@/server/config';

export default  () => {
    const [hours, minutes] = config.cronTestTime.split(':')

    return moment()
        .set({
            hours: parseInt(hours),
            minutes: parseInt(minutes)
        })
}
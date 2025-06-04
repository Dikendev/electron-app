import { TimePicker } from 'antd';
import dayjs from 'dayjs';

interface FinalDepartureTimeProps {
    expectedWorkingTimeTotal: string;
    onChange: (date: any, dateString: string | string[]) => void
}

const format = 'HH:mm';

const FinalDepartureTime = ({
    expectedWorkingTimeTotal,
    onChange,
}: FinalDepartureTimeProps) => {
    return (
        <div className='expected_working_time_total'>
            <p className="tip">Defina sua carga horária para hoje?</p>

            <TimePicker placeholder='HH:SS' defaultValue={dayjs(expectedWorkingTimeTotal && expectedWorkingTimeTotal.length ? expectedWorkingTimeTotal : '08:45', format)} format={format} onChange={onChange} />
        </div>
    )
}

export default FinalDepartureTime;

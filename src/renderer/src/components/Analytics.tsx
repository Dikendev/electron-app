import { useState } from 'react';
import Overtime from './Analytics/Overtime';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';

const Analytics = () => {
    const [workingTime, setWorkingTime] = useState<string>('08:45');

    const onChange = (_date: any, dateString: string | string[]) => {
        if (!dateString) return;
        if (!Array.isArray(dateString)) setWorkingTime(dateString)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem', padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', width: '100%' }}>
                <p className='tip'>Sua carga horária diária de trabalho:</p>
                <TimePicker placeholder='HH:SS' defaultValue={dayjs(workingTime, 'HH:mm')} format={'HH:mm'} onChange={onChange} />
            </div>
            <Overtime workingTime={workingTime} />
        </div>
    );
}
export default Analytics

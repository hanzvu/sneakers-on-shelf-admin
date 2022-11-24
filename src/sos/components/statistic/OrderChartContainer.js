import { useState } from 'react';
// components
import { getFirstDayInMonth } from '../common/DateUtils';
import OrderChart from './OrderChart';

export default function OrderChartContainer({ ...other }) {

    const [data, setData] = useState({ fromDate: getFirstDayInMonth(new Date), toDate: new Date() })

    return (<>
        <OrderChart dates={data} setDates={setData} />
    </>)
}
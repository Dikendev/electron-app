import { useEffect, useRef, useState } from "react";
import * as echarts from 'echarts';

const TotalDayHours = () => {
    // const [chart, setChart] = useState<any>(null);
    const refChart = useRef<any>(null)

    useEffect(() => {
        if (refChart?.current) {
            const chart = echarts.init(refChart.current);
            // Draw the chart
            chart.setOption({
                title: {
                    text: 'Horas Trabalhadas por dia',
                    subtext: 'Um teste de subText'
                },
                tooltip: {},
                xAxis: {
                    data: ['23/05', '24/05', '25/05', '01/06', '14/06']
                },
                yAxis: {},
                series: [
                    {
                        name: 'Horas Trabalhadas',
                        type: 'bar',
                        label: {
                            show: true,
                        },
                        data: [9.5, 8.5, 9.37, 11.13, 10.62]
                    }
                ]
            });
            // setChart(chart)
        }
    }, [])

    return (
        <div style={{ height: '25rem', width: '100%' }} ref={refChart}></div>
    )
}

export default TotalDayHours;

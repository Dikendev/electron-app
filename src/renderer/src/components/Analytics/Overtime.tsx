import { useEffect, useRef } from "react";
import * as echarts from 'echarts';
import { Descriptions, DescriptionsProps } from "antd";

interface Overtime {
    workingTime: string
}

const Overtime = ({ workingTime }: Overtime) => {
    // const [chart, setChart] = useState<any>(null);
    const refChart = useRef<any>(null)
    const workTimes = [9.5, 8.5, 9.37, 11.13, 10.62, 9.5, 8.5, 9.37, 11.13, 10.62]

    const dailyLimit = Number(workingTime.replace(':', '.'))

    const extraHours = workTimes.map(wt => Math.max(wt - dailyLimit, 0))

    const totalNormal = workTimes.reduce((acc, h) => acc + h, 0).toFixed(2)
    const totalExtra = extraHours.reduce((acc, h) => acc + h, 0).toFixed(2)

    const rawData: number[][] = [
        workTimes,
        new Array(workTimes.length).fill(Number(workingTime.replace(':', '.')))
    ]

    useEffect(() => {
        return (() => {
            if (refChart?.current) {
                echarts.dispose(refChart?.current)
            }
        })
    }, [])

    useEffect(() => {
        if (refChart?.current) {
            const chart = echarts.init(refChart.current)

            const xAxis = ['23/05', '24/05', '25/05', '26/05', '27/05', '28/05', '29/05', '30/05', '31/05', '01/06']

            const series = [
                'Horas trabalhadas',
                'Hora Extra',
            ].map((name, sid) => {
                return {
                    name,
                    type: 'bar',
                    stack: 'total',
                    barWidth: '60%',
                    label: {
                        show: true,
                        formatter: (params) => Number(params.value).toFixed(2)
                    },
                    data: rawData[sid].map((d, did) => sid ? Number(rawData[0][did] - d).toFixed(2) : d),
                };
            });

            const options = {
                title: {
                    text: 'Horas Trabalhadas por dia',
                    subtext: 'Um teste de subText'
                },
                tooltip: {},
                legend: {
                    selectedMode: false
                },
                grid: {
                    left: 100,
                    right: 100,
                    top: 50,
                    bottom: 50
                },
                yAxis: {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    data: xAxis
                },
                textStyle: {
                    color: '#fff'
                },
                // darkMode: true,
                series
            }

            console.log('chart', chart)

            chart.setOption(options)
            // setChart(chart)
        }
    }, [rawData])


    const items: DescriptionsProps['items'] = [
        {
            key: totalNormal,
            label: 'Total de Horas Trabalhadas',
            children: totalNormal,
        },
        {
            key: totalNormal,
            label: 'Total de Horas Extras',
            children: totalExtra,
        },
    ]

    return (
        <>
            <div style={{ height: '25rem' }} ref={refChart}></div>
            <Descriptions style={{ borderRadius: '0.6rem' }} layout="vertical" bordered items={items} />
        </>
    )
}

export default Overtime;


// import React, { useEffect, useState } from 'react'
// import Chart from 'react-google-charts'
// const LineChart = ({historicalData}) => {
// const [data, setData] = useState([["Date","Prices"]])
// useEffect(()=>{
//     let dataCopy = [["Date", "Prices"]];
//         if(historicalData.prices){
//             historicalData.prices.map((item)=>{
//                 dataCopy.push([`${new Date(item[0]).toLocaleDateString().slice(0,-5)}`, item[1]])
//             })
//             setData(dataCopy);
//         }//date-->25/01
//     },[historicalData])

//   return (
//     <Chart
//         chartType='LineChart'
//         data={data}
//         height="100%"
//         legendToggle
//     />
//   )
// }

// export default LineChart


import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ historicalData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (historicalData?.prices) {
      const labels = historicalData.prices.map(item =>
        new Date(item[0]).toLocaleDateString().slice(0, -5)
      );
      const prices = historicalData.prices.map(item => item[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Price Trend',
            data: prices,
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      });
    }
  }, [historicalData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Last 10 Days Price Trend',
      },
    },
  };

  return chartData ? <Line data={chartData} options={options} /> : <p>Loading chart...</p>;
};

export default LineChart;



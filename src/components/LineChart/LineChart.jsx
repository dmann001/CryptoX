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
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import './LineChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement
);

const ChartTypes = {
  LINE: 'line',
  CANDLESTICK: 'candlestick'
};

const LineChart = ({ historicalData }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState(ChartTypes.LINE);

  // Function to format OHLC data
  const formatCandlestickData = (data) => {
    if (!data?.prices) return null;
    return data.prices.map(item => ({
      x: item[0],
      o: item[1] * 0.99,
      h: item[1] * 1.02,
      l: item[1] * 0.98,
      c: item[1]
    }));
  };

  useEffect(() => {
    if (historicalData?.prices) {
      if (chartType === ChartTypes.LINE) {
      const labels = historicalData.prices.map(item =>
          format(new Date(item[0]), 'MMM d')
      );
      const prices = historicalData.prices.map(item => item[1]);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Price Trend',
            data: prices,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointBackgroundColor: '#2563eb',
              pointHoverBackgroundColor: '#ffffff',
              pointHoverBorderColor: '#2563eb',
              pointHoverBorderWidth: 2,
            },
          ],
        });
      } else {
        const candlestickData = formatCandlestickData(historicalData);
        setChartData({
          datasets: [
            {
              label: 'Candlestick',
              data: candlestickData,
              borderColor: ctx => (ctx.parsed && ctx.parsed.c >= ctx.parsed.o ? '#22c55e' : '#ef4444'),
              backgroundColor: ctx => (ctx.parsed && ctx.parsed.c >= ctx.parsed.o ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
              borderWidth: 2,
              borderSkipped: false,
              candleWidth: 0.6,
              barPercentage: 0.8
          },
        ],
      });
    }
    }
  }, [historicalData, chartType]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 10,  // Reduced top padding since we don't have title
        bottom: 20
      }
    },
    plugins: {
      legend: {
        display: false,  // Hide legend since we have buttons
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          title: (tooltipItems) => {
            if (tooltipItems[0]) {
              const date = new Date(tooltipItems[0].raw.x || tooltipItems[0].label);
              return format(date, 'MMM d, yyyy');
            }
            return '';
          },
          label: (context) => {
            if (chartType !== ChartTypes.LINE) {
              const item = context.raw;
              return [
                `Open: $${item.o.toFixed(2)}`,
                `High: $${item.h.toFixed(2)}`,
                `Low: $${item.l.toFixed(2)}`,
                `Close: $${item.c.toFixed(2)}`
              ];
            }
            return `$${context.raw.toFixed(2)}`;
          }
        },
        bodyFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
          weight: '600',
        },
      },
    },
    scales: {
      x: {
        type: chartType === ChartTypes.LINE ? 'category' : 'time',
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          callback: function(value) {
            const date = chartType === ChartTypes.LINE 
              ? new Date(historicalData.prices[value]?.[0]) 
              : new Date(value);
            return format(date, 'MMM d');
          }
        },
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM d'
          }
        }
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        position: 'right',
        ticks: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const renderChart = () => {
    if (!chartData) return <p>Loading chart...</p>;

    return chartType === ChartTypes.CANDLESTICK 
      ? <Chart type="candlestick" data={chartData} options={options} />
      : <Line data={chartData} options={options} />;
  };

  return (
    <div className="chart-container">
      <div className="chart-controls-wrapper">
        <div className="chart-controls">
          <button
            className={`chart-button ${chartType === ChartTypes.LINE ? 'active' : ''}`}
            onClick={() => setChartType(ChartTypes.LINE)}
          >
            <span className="button-text">Line</span>
          </button>
          <button
            className={`chart-button ${chartType === ChartTypes.CANDLESTICK ? 'active' : ''}`}
            onClick={() => setChartType(ChartTypes.CANDLESTICK)}
          >
            <span className="button-text">Candlestick</span>
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        {renderChart()}
      </div>
    </div>
  );
};

export default LineChart;



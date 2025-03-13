import React, { useEffect, useState, useContext } from 'react';
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
  LogarithmicScale,
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { CoinContext } from '../../context/CoinContext';
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
  OhlcElement,
  zoomPlugin,
  LogarithmicScale,
  Filler
);

const ChartTypes = {
  LINE: 'line',
  CANDLESTICK: 'candlestick'
};

const TimeRanges = {
  DAY: '24h',
  WEEK: '1w',
  MONTH: '1m',
  THREE_MONTHS: '3m',
  SIX_MONTHS: '6m',
  YEAR: '1y'
};

const LineChart = ({ historicalData, onTimeRangeChange }) => {
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState(ChartTypes.LINE);
  const [timeRange, setTimeRange] = useState(TimeRanges.DAY);
  const { currency } = useContext(CoinContext);

  const getDaysFromRange = (range) => {
    switch (range) {
      case TimeRanges.DAY:
        return 1;
      case TimeRanges.WEEK:
        return 7;
      case TimeRanges.MONTH:
        return 30;
      case TimeRanges.THREE_MONTHS:
        return 90;
      case TimeRanges.SIX_MONTHS:
        return 180;
      case TimeRanges.YEAR:
        return 365;
      default:
        return 1;
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    const days = getDaysFromRange(range);
    onTimeRangeChange(days);
  };

  const getFilteredData = (data, range) => {
    if (!data?.prices) return null;
    const now = new Date();
    let startDate;

    switch (range) {
      case TimeRanges.DAY:
        startDate = subDays(now, 1);
        break;
      case TimeRanges.WEEK:
        startDate = subDays(now, 7);
        break;
      case TimeRanges.MONTH:
        startDate = subMonths(now, 1);
        break;
      case TimeRanges.THREE_MONTHS:
        startDate = subMonths(now, 3);
        break;
      case TimeRanges.SIX_MONTHS:
        startDate = subMonths(now, 6);
        break;
      case TimeRanges.YEAR:
        startDate = subYears(now, 1);
        break;
      default:
        return data.prices;
    }

    // Convert timestamps to numbers for comparison
    const startTimestamp = startDate.getTime();
    return data.prices.filter(item => item[0] >= startTimestamp);
  };

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
      const filteredData = getFilteredData(historicalData, timeRange);
      if (!filteredData) return;

      if (chartType === ChartTypes.LINE) {
        const formattedData = filteredData.map(item => ({
          x: new Date(item[0]).getTime(),
          y: item[1]
        }));

        setChartData({
          datasets: [
            {
              label: 'Price Trend',
              data: formattedData,
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
        const candlestickData = formatCandlestickData({ prices: filteredData });
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
  }, [historicalData, chartType, timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 20
      }
    },
    plugins: {
      legend: {
        display: false,
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
              const date = new Date(tooltipItems[0].parsed.x);
              return format(date, 'MMM d, yyyy HH:mm');
            }
            return '';
          },
          label: (context) => {
            if (chartType !== ChartTypes.LINE) {
              const item = context.raw;
              return [
                `Open: ${currency.symbol}${item.o.toFixed(2)}`,
                `High: ${currency.symbol}${item.h.toFixed(2)}`,
                `Low: ${currency.symbol}${item.l.toFixed(2)}`,
                `Close: ${currency.symbol}${item.c.toFixed(2)}`
              ];
            }
            return `${currency.symbol}${context.parsed.y.toFixed(2)}`;
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
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'ctrl',
          },
          pinch: {
            enabled: true,
          },
        },
        pan: {
          enabled: true,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
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
            return format(new Date(value), 'MMM d');
          }
        },
        time: {
          unit: timeRange === TimeRanges.DAY ? 'hour' : 'day',
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM d'
          }
        },
        adapters: {
          date: {
            zone: 'UTC'
          }
        }
      },
      y: {
        type: 'linear',
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
            return currency.symbol + value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
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
          <div className="chart-type-controls">
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
          <div className="time-range-controls">
            {Object.values(TimeRanges).map(range => (
              <button
                key={range}
                className={`time-range-button ${timeRange === range ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange(range)}
              >
                <span className="button-text">{range}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-wrapper">
        {renderChart()}
      </div>
    </div>
  );
};

export default LineChart;



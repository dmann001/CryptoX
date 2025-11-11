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
  const [chartRef, setChartRef] = useState(null);
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

  // Function to format OHLC data with better variation
  const formatCandlestickData = (data) => {
    if (!data?.prices) return null;

    return data.prices.map((item, index) => {
      const price = item[1];
      const prevPrice = index > 0 ? data.prices[index - 1][1] : price;
      const nextPrice = index < data.prices.length - 1 ? data.prices[index + 1][1] : price;

      // Calculate realistic OHLC values based on price trend
      const avgPrice = (prevPrice + price + nextPrice) / 3;
      const volatility = Math.abs(price - avgPrice) / avgPrice;
      const spread = Math.max(volatility * 2, 0.01); // At least 1% spread

      const open = prevPrice;
      const close = price;
      const high = Math.max(open, close) * (1 + spread);
      const low = Math.min(open, close) * (1 - spread);

      return {
        x: item[0],
        o: open,
        h: high,
        l: low,
        c: close
      };
    });
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
              label: 'Price',
              data: candlestickData,
              color: {
                up: '#22c55e',
                down: '#ef4444',
                unchanged: '#9ca3af',
              },
              borderColor: {
                up: '#16a34a',
                down: '#dc2626',
                unchanged: '#6b7280',
              },
              borderWidth: 1.5,
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
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
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
            return `Price: ${currency.symbol}${context.parsed.y.toFixed(2)}`;
          }
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        titleFont: {
          size: 13,
          family: "'Inter', sans-serif",
          weight: '600',
        },
      },
      zoom: {
        limits: {
          x: {min: 'original', max: 'original'},
          y: {min: 'original', max: 'original'}
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
          modifierKey: null,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: '#6b7280',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: window.innerWidth < 768 ? 6 : 10,
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
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false
        },
        position: 'right',
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif",
          },
          color: '#6b7280',
          maxTicksLimit: 8,
          callback: function(value) {
            if (value >= 1000000) {
              return currency.symbol + (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return currency.symbol + (value / 1000).toFixed(1) + 'K';
            }
            return currency.symbol + value.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2
            });
          }
        },
      },
    },
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false,
    },
  };

  const handleResetZoom = () => {
    if (chartRef) {
      chartRef.resetZoom();
    }
  };

  const renderChart = () => {
    if (!chartData) return <p className="loading-text">Loading chart...</p>;

    return chartType === ChartTypes.CANDLESTICK
      ? <Chart ref={setChartRef} type="candlestick" data={chartData} options={options} />
      : <Line ref={setChartRef} data={chartData} options={options} />;
  };

  return (
    <div className="chart-container">
      <div className="chart-controls-wrapper">
        <div className="chart-controls">
          <div className="chart-type-controls">
            <button
              className={`chart-button ${chartType === ChartTypes.LINE ? 'active' : ''}`}
              onClick={() => setChartType(ChartTypes.LINE)}
              aria-label="Switch to line chart"
            >
              <span className="button-text">Line</span>
            </button>
            <button
              className={`chart-button ${chartType === ChartTypes.CANDLESTICK ? 'active' : ''}`}
              onClick={() => setChartType(ChartTypes.CANDLESTICK)}
              aria-label="Switch to candlestick chart"
            >
              <span className="button-text">Candlestick</span>
            </button>
            <button
              className="chart-button reset-zoom"
              onClick={handleResetZoom}
              aria-label="Reset zoom"
            >
              <span className="button-text">Reset Zoom</span>
            </button>
          </div>
          <div className="time-range-controls">
            {Object.values(TimeRanges).map(range => (
              <button
                key={range}
                className={`time-range-button ${timeRange === range ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange(range)}
                aria-label={`Show ${range} data`}
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
      <div className="chart-help-text">
        <p>💡 Desktop: Ctrl+Scroll to zoom, Click and drag to pan | Mobile: Pinch to zoom, Swipe to pan</p>
      </div>
    </div>
  );
};

export default LineChart;



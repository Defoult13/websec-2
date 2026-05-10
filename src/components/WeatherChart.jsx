import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function WeatherChart({ records }) {
  const labels = records.map((item) =>
    item.dt_forecast?.slice(11, 16)
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Осадки',
        data: records.map((item) => Number(item.prate)),
        borderColor: '#00aef0',
        backgroundColor: '#00aef0',
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 2
      },
      {
        label: 'Темп.',
        data: records.map((item) => Number(item.temp_2_cel)),
        borderColor: '#ff3030',
        backgroundColor: '#ff3030',
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 2
      },
      {
        label: 'Ветер',
        data: records.map((item) => Number(item.wind_speed_10)),
        borderColor: '#00e632',
        backgroundColor: '#00e632',
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 2
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'left',
      labels: {
        color: '#000',
        font: {
          size: 18
        },
        boxWidth: 18,
        boxHeight: 18
      }
    }
  },
  scales: {
     x: {
    ticks: {
      color: '#000',
      font: {
        size: 12
      },
      maxRotation: 45,
      minRotation: 45
    },
    grid: {
      display: false
    }
    }
  }
};

  return <Line data={data} options={options} />;
}

export default WeatherChart;
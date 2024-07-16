import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Currencies() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState({
    startDate: "2020-01-01",
    endDate: "2020-02-28",
  });

  const { currency } = useParams();
  const notifyFailedOperation = () => toast.error("No se encontraron datos.");

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tablero de divisas",
      },
    },
  };

  useEffect(() => {
    const getRates = async (cur) => {
      const res = await axios.get(
        `https://api.exchangerate.host/timeseries?start_date=${date.startDate}&end_date=${date.endDate}&base=USD&symbols=${cur}`
      );

      const rates = await res.data.rates;
      const labels = Object.keys(rates);

      const dataValues = Object.keys(rates).map((e) => rates[e][cur]);

      if (dataValues.includes(undefined)) {
        notifyFailedOperation();
      }

      setData({
        labels,
        datasets: [
          {
            label: `Un dólar, vale en ${cur}`,
            data: dataValues,
            borderColor: "#000a8b",
            pointBackgroundColor: "#f42534",
            pointRadius: 7,
          },
        ],
      });
      setLoading(false);
    };

    getRates(currency);
  }, [currency, date]);

  const handleDate = (e) => {
    setDate({
      ...date,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="w-80 px-10 pb-10 pt-5">
          <label htmlFor="date" className="text-sm font-medium text-gray-700">
            Escoge una fecha de inicio
          </label>
          <input
            type="date"
            onChange={(e) => handleDate(e)}
            value={date.startDate}
            name="startDate"
            className="flex-1 block w-full border-2 min-w-0 rounded text-sm border-gray-300"
          />
          <label
            htmlFor="date"
            className="text-sm font-medium text-gray-700 mt-10"
          >
            Escoge una fecha de término
          </label>
          <input
            type="date"
            onChange={(e) => handleDate(e)}
            value={date.endDate}
            name="endDate"
            className="flex-1 block w-full border-2 min-w-0 rounded text-sm border-gray-300"
          />
        </div>

        <div className="px-7">
          <Toaster position="top-right" reverseOrder={false} />
          {loading ? "Cargando" : <Line options={options} data={data} />}
        </div>
      </div>
    </>
  );
}

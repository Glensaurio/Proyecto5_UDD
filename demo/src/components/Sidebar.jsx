import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const getCurrencies = async () => {
      const res = await axios.get("https://api.exchangerate.host/latest");
      const data = await res.data.rates;
      const arrData = Object.keys(data);

      setCurrencies(arrData);
    };

    getCurrencies();
  }, []);

  return (
    <div className=" flex">
      <div className="bg-indigo-700 w-64">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-white">¿Cuánto vale esta moneda en USD?</h1>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {currencies.map((e, i) => {
                  return (
                    <Link
                      key={i}
                      to={`/${e}`}
                      className="bg-indigo-800 text-white group flex items-center px-2 py-2 text-sm font-medium"
                    >
                      <svg
                        className="mr-3 h-6 w-6 text-indigo-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                      {e}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

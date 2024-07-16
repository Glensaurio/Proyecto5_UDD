![Banner](./../images/banner.png)

# PROYECTO 5: Demo

**LINK A PRODUCCIÓN:** https://sevenm-fullstack-m5-proy.onrender.com

## Planteamiento

En esta demo, desarrollamos una aplicación que mostrará diferentes divisas y su comportamiento con respecto al dólar.

Estaremos obteniendo la información directamente de una API para posteriormente trazarla en una interfaz. El usuario será capaz de utilizar campos de texto para determinar las fechas en las cuales quiere enfocar el análisis.

![](./../images/tablero.png)

## Requerimientos

Para usar este proyecto, es necesario:

- Clonar este repositorio
- Acceder a esta carpeta a través de la terminal.

```shell
$ cd demo/
```

- Realizar la instalación de dependencias

```shell
$ npm install
```

- Ejecutar el proyecto con el `script` de `dev`

```shell
$ npm run dev
```

- Para el proceso de despliegue, es importante realizar este configuración en https://render.com al llegar a la página de establecimiento de comandos. No se necesitan variables de entorno porque usamos una API pública.

![](./../images/render-config.png)

## Solución general

Nuestro proyecto utiliza esta arquitectura de carpetas:

```scss
- demo
│  ├─ .eslintrc.cjs
│  ├─ .prettierrc
│  ├─ README.md
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ vite.svg
│  ├─ src
│  │  ├─ assets
│  │  │  ├─ components
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ Header
│  │  │  │  └─ index.jsx
│  │  │  └─ Sidebar.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Currencies.jsx
│  │  │  ├─ Error.jsx
│  │  │  └─ Root.jsx
│  │  └─ router.jsx
│  ├─ tailwind.config.js
│  └─ vite.config.js

```

Se destacan los siguientes puntos:

- Uso de `vite` como generador de proyecto.
- Uso de `linters` con `.eslintrc.cjs` y `code formatting` con `.prettierrc`. El primero se utiliza para establecer un análisis sobre problemas y errores potenciales respecto al lenguaje que se está usando. Y, el segundo es un formateador de código para que se vea consistente en todo el proyecto.
- Uso de `TailwindCSS` como principal framework CSS. Puedes realizar la instalación en esta página si lo necesitaras para otro proyecto: https://tailwindcss.com/docs/guides/vite
- Uso de `React Router` en su versión v6. Puedes encontrar la documentación aqui: https://reactrouter.com/en/main/start/tutorial
- Separación de una carpeta `components` y `pages`. En `components`, establecerás todo el código que consideres que pudiera ser reusable en diferentes páginas. Y, en `pages`, colocarás los componentes que se asignarán directamente a una ruta y contendrán toda la información del mismo (en ellos puedes importar todos los componentes que gustes para alcanzar el objetivo deseado).
- Uso de `useEffect` para el manejo de `sideEffects`. Profundiza en el código de `Sidebar.jsx` para comprender cómo estamos obteniendo la información.

```javascript
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
    // ...
  );
}
```

- Uso de `chart.js` y `react-chartjs-2` para el manejo de gráficos. En algunas aplicaciones, querrás mostrar un patrón de datos a través de una gráfica. Es por eso que puedes utilizar estas librerías para trabajar mucho mejor este tipo de objetivos. Conoce más en este link: https://react-chartjs-2.js.org/

- Manejo de errores hacia el usuario. Es importante que el usuario en cada momento conozca qué es lo que está pasando con la transferencia de datos, por ello se utiliza `react-hot-toast` para las notificaciones. En caso de que una moneda no esté accesible porque la API no lo puede proporcionar, aparecerá un mensaje de `Los datos no se encuentran disponibles.`. Es de tu elección usar esta librería para el manejo de notificaciones: https://react-hot-toast.com/

- Uso de campos de texto. Observa el manejo de fechas que el usuario puede implementar. Se aplican ciclos de vida, junto con `useState` y `useEffect` para actualizar el contenido correctamente. Para coincidir la ruta de las divisas, utilizamos `useParam` para extraer el parámetro de la URL y usarlo en el mismo componente.

```javascript

// ...

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

    // ...
    </>
  );
}

```

Usa toda esta información para crear una aplicación con eficiente arquitectura y la mejor calidad posible.

import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import Currencies from "./pages/Currencies";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/:currency",
        element: <Currencies />,
      },
    ],
  },
]);

export default router;

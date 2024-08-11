import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Layout } from "./Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/home.page";

Chart.register(CategoryScale);


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
]);


function App() {

  return (
    <>
        <Layout> 
          <RouterProvider router={router} />
        </Layout>
    </>
  )

}



export default App
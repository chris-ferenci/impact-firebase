import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Routes
import ErrorPage from "./error-page.jsx";
import About from "./routes/About.jsx"
import JobDetailsPage from './routes/JobDetailsPage.jsx';
import JobBoard from './routes/JobBoard.jsx';
import JobDetails from './components/JobDetails/JobDetails.jsx';
import OpportunitiesHub from './routes/OpportunitiesHub.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />
  },
  // {
  //   path: "/job/",
  //   element: <JobDetailsPage/>,
  // },
  {
    path: "/jobs",
    element: <JobBoard/>,
  },
  {
    path: "/jobs/:id",
    element: <JobDetailsPage/>,
  },
  {
    path: "/hub",
    element: <OpportunitiesHub/>,
  },
  {
    path: "/about",
    element: <About/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

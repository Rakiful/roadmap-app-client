import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { MainLayouts } from './Layouts/MainLayouts.jsx';
import { Home } from './Components/Home/Home.jsx';
import { SignIn } from './Components/SignIn/SignIn.jsx';
import { SignUp } from './Components/SignUp/SignUp.jsx';
import { AuthProvider } from './Contexts/AuthProvider.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts/>,
    children:[
      {
        index: true,
        element : <Home/>
      },
      {
        path: "/sign-in",
        element : <SignIn/>
      },
      {
        path: "/sign-up",
        element : <SignUp/>
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

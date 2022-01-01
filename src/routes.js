import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import ProductSample from './pages/ProductSample';
import Blog from './pages/Blog';
import Products from './pages/Products';
import NotFound from './pages/Page404';
import Categories from './pages/Categories';
import Order from './pages/Order';
import UserAdd from './components/_dashboard/user/UserAdd';
import Revenue from './pages/Revenue';
import Account from './pages/Account';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'products', element: <Products /> },
        { path: 'categories', element: <Categories /> },
        { path: 'order', element: <Order /> },
        // { path: 'products', element: <ProductSample /> },
        { path: 'blog', element: <Blog /> },
        { path: 'addFood', element: <UserAdd /> },
        // { path: 'revenue', element: <Revenue /> },
        { path: 'account', element: <Account /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

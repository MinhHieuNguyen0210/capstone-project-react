import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

import { PrivateRoute } from './fakeAuth';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <Router />
    </ThemeConfig>
  );
}

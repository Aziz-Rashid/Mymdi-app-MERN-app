import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const UserProfile = React.lazy(() => import('./views/userProfile'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/userprofile', name: 'UserProfile', component: UserProfile },
];

export default routes;

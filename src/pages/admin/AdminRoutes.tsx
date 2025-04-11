
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// This is a placeholder for AdminRoutes
const AdminRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<div>Admin Dashboard</div>} />
        <Route path="/settings" element={<div>Admin Settings</div>} />
      </Routes>
    </Layout>
  );
};

export default AdminRoutes;

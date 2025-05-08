'use client';

import { Route, Routes } from 'react-router-dom';
import Team from './pages/Team';

import './main.css';
import Layout from './components/Layout';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Team />} />
        </Route>
      </Routes>
    </div>
  );
}

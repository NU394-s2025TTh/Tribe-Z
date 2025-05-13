'use client';

import { Route, Routes } from 'react-router-dom';
import Team from './pages/Team';

import './main.css';
import Layout from './components/Layout';
import Home from './pages/Home';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
    </div>
  );
}

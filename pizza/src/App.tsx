'use client';

import { Route, Routes } from 'react-router-dom';
import Team from './pages/Team';

import './main.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import PizzaPackage from './pages/PizzaPackage';
import RecipeDetails from './pages/RecipeDetails';
import Ingredients from './pages/Ingredients';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/team" element={<Team />} />
          <Route path="/package/:pizzaName" element={<PizzaPackage />} />
          <Route path="/recipes/:recipeId" element={<RecipeDetails />} />
          <Route path="/materials" element={<Ingredients />} />
        </Route>
      </Routes>
    </div>
  );
}

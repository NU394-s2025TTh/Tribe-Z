/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

import cors from 'cors';
import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';

// Kroger Access Endpoint
import { fetchLocationsByZip, fetchProductsBySearch } from './kroger';

admin.initializeApp();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'die!!' });
});

app.get('/', (req, res) => {
  res.send({ message: 'Testing the automatic build!' });
});

app.get('/api/kroger-locations', async (req, res) => {
  const zipCode = req.query.zip as string;

  if (!/^\d{5}$/.test(zipCode)) {
    return res.status(400).json({ error: 'Invalid or missing zip code' });
  }

  try {
    const locations = await fetchLocationsByZip(zipCode);
    return res.json(locations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

app.get('/api/kroger-products', async (req, res) => {
  const locationId = req.query.locationId as string;
  const searchTerm = req.query.searchTerm as string;

  if (!locationId || !searchTerm) {
    return res.status(400).json({ error: 'Missing locationId or searchTerm' });
  }

  try {
    const products = await fetchProductsBySearch(locationId, searchTerm);
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

export const main = onRequest({ cors: true }, app);

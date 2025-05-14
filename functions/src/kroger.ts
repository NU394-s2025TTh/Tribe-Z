import dotenv from 'dotenv';
dotenv.config();

import https from 'https';
import querystring from 'querystring';
import zlib from 'zlib';

const clientId = process.env.KROGER_CLIENT_ID!;
const clientSecret = process.env.KROGER_CLIENT_SECRET!;

// Getting the access token, not exposed to the user but
// required to make any calls to the locations/products
// endpoints!
export async function fetchAccessToken(): Promise<string> {
  const postData = querystring.stringify({
    grant_type: 'client_credentials',
    scope: 'product.compact',
  });

  const base64Credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );

  const options = {
    hostname: 'api.kroger.com',
    port: 443,
    path: '/v1/connect/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      Authorization: `Basic ${base64Credentials}`,
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const encoding = res.headers['content-encoding'];
      let stream: NodeJS.ReadableStream = res;

      if (encoding === 'gzip') {
        stream = res.pipe(zlib.createGunzip());
      } else if (encoding === 'deflate') {
        stream = res.pipe(zlib.createInflate());
      }

      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const data = buffer.toString();

        try {
          const parsed = JSON.parse(data);
          resolve(parsed.access_token);
        } catch (err) {
          reject(new Error('Failed to parse token response'));
        }
      });

      stream.on('error', reject);
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Using a zip code passed in from the client, search locations near a zip code!
export async function fetchLocationsByZip(zipCode: string): Promise<any> {
  const accessToken = await fetchAccessToken();

  const options = {
    hostname: 'api.kroger.com',
    port: 443,
    path: `/v1/locations?filter.zipCode.near=${zipCode}&filter.radiusInMiles=10&filter.limit=5`,
    // i chose to limit the radius to 10 miles, and 5 stores just for now!
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const encoding = res.headers['content-encoding'];
      let stream: NodeJS.ReadableStream = res;

      if (encoding === 'gzip') {
        stream = res.pipe(zlib.createGunzip());
      } else if (encoding === 'deflate') {
        stream = res.pipe(zlib.createInflate());
      }

      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const data = buffer.toString();

        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error('Failed to parse Kroger locations response'));
        }
      });

      stream.on('error', reject);
    });

    req.on('error', reject);
    req.end();
  });
}

// using a location id and a search term, search said store for 'x' item!
export async function fetchProductsBySearch(
  locationId: string,
  searchTerm: string
): Promise<any> {
  const accessToken = await fetchAccessToken();
  const encodedSearchTerm = encodeURIComponent(searchTerm);

  const options = {
    hostname: 'api.kroger.com',
    port: 443,
    path: `/v1/products?filter.term=${encodedSearchTerm}&filter.locationId=${locationId}`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const encoding = res.headers['content-encoding'];
      let stream: NodeJS.ReadableStream = res;

      if (encoding === 'gzip') {
        stream = res.pipe(zlib.createGunzip());
      } else if (encoding === 'deflate') {
        stream = res.pipe(zlib.createInflate());
      }

      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const data = buffer.toString();

        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error('Failed to parse Kroger products response'));
        }
      });

      stream.on('error', reject);
    });

    req.on('error', reject);
    req.end();
  });
}

require('dotenv').config();
const https = require('https');

const EDGE_CONFIG_ID = 'ecfg_bf8jpahyz5up9jyauo7tdqjmu2d4';
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

async function setupEdgeConfig() {
  const data = JSON.stringify({
    items: [
      {
        operation: 'upsert',
        key: 'database',
        value: {
          url: process.env.DATABASE_URL
        }
      }
    ]
  });

  const options = {
    hostname: 'api.vercel.com',
    path: `/v1/edge-config/${EDGE_CONFIG_ID}/items`,
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    console.log('Sending request to Edge Config API...');
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('Successfully set database configuration in Edge Config');
            resolve(response);
          } else {
            console.error('Failed to set Edge Config:', response);
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(response)}`));
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error setting Edge Config:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

setupEdgeConfig().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
}); 
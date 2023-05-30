const axios = require('axios');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  };

  // Return CORS headers for preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',  // body must be empty
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({error: 'This endpoint supports only POST requests'}),
    };
  }

  const reqData = JSON.parse(event.body);
  const requestHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': event.headers['x-api-key'],
  };

  try {
    const response = await axios.post('https://api.anthropic.com/v1/complete', reqData, { headers: requestHeaders });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({error: 'Internal Server Error'}),
    };
  }
};

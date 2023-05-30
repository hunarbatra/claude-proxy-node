const axios = require('axios');

exports.handler = async function(event, context) {
  // Standard CORS headers
  const headers = {
    'Access-Control-Allow-Origin': event.headers['origin'] || '*',
    'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  // Preflight request. Reply successfully:
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200, // <-- Must be 200 otherwise pre-flight call fails
      headers: headers,
      body: 'This was a preflight call!'
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({error: 'This endpoint supports only POST requests'})
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
      headers: headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response && error.response.status ? error.response.status : 500,
      headers: headers,
      body: JSON.stringify({error: 'Internal Server Error'}),
    };
  }
};

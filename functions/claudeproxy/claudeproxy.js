const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({error: 'This endpoint supports only POST requests'}),
    };
  }

  const reqData = JSON.parse(event.body);
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': event.headers['x-api-key'],
  };

  try {
    const response = await axios.post('https://api.anthropic.com/v1/complete', reqData, { headers });
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,x-api-key',
        'Access-Control-Allow-Methods': 'GET,POST',
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal Server Error'}),
    };
  }
};

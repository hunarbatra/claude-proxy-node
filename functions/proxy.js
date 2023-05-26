// functions/proxy.js
const axios = require('axios');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const req_data = JSON.parse(event.body);
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': event.headers['x-api-key'] || ''
    };

    try {
        const response = await axios.post('https://api.anthropic.com/v1/complete', req_data, { headers });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key'
            }
        };
    } catch (error) {
        return {
            statusCode: error.response.status,
            body: JSON.stringify(error.response.data)
        };
    }
};


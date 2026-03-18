const API_ROOT = 'https://quizapi.io/api/v1';
const DEFAULT_API_KEY = 'BSBME7NJflwnFFbRbSBHlIHWmBh5XQc5GAXkKyu7';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const pathSegments = Array.isArray(req.query.path) ? req.query.path : [];
  const upstreamUrl = new URL(`${API_ROOT}/${pathSegments.join('/')}`);
  const apiKey = process.env.QUIZAPI_KEY || DEFAULT_API_KEY;

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === 'path') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => upstreamUrl.searchParams.append(key, item));
      return;
    }

    if (typeof value === 'string') {
      upstreamUrl.searchParams.set(key, value);
    }
  });

  upstreamUrl.searchParams.set('apiKey', apiKey);

  try {
    const upstreamResponse = await fetch(upstreamUrl);
    const responseText = await upstreamResponse.text();

    res.status(upstreamResponse.status);

    const contentType = upstreamResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.send(responseText);
  } catch (error) {
    res.status(502).json({
      error: 'QuizAPI proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

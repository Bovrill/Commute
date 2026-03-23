export default async function handler(req, res) {
  const { from, to, rows = 3 } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Missing from or to parameter' });
  }

  const token = process.env.DARWIN_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'DARWIN_TOKEN not configured' });
  }

  try {
    const url = `https://huxley2.azurewebsites.net/departures/${from}/to/${to}/${rows}?accessToken=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Huxley2 returned ${response.status}` });
    }

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

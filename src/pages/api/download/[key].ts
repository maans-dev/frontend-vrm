import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { getToken } from 'next-auth/jwt';

const headers = ['Content-Type', 'Content-Disposition'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  const accessToken = token?.accessToken;

  if (accessToken == null) {
    res.status(401).send('Unauthorized');
    return;
  }

  const { key } = req.query;

  if (Array.isArray(key)) {
    res.status(400).send('Bad Request: can only request one file at a time');
    return;
  }

  const params = new URLSearchParams();
  params.set('key', key);
  const url = `${process.env.NEXT_PUBLIC_API_BASE}/file?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });
  try {
    res.status(response.status);

    for (const name of headers) {
      const val = response.headers.get(name);
      if (val != null) {
        res.setHeader(name, val);
      }
    }

    // @ts-expect-error
    const stream = Readable.fromWeb(response.body);
    stream.pipe(res);
  } catch (err) {
    res.status(500).send(err.toString());
  }
}

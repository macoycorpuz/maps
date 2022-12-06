import { NextApiRequest, NextApiResponse } from 'next';
import { data } from '../../data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const layer = data.filter(d => d.id === id)[0];
  if (!layer) {
    return res.status(404).send('Layer not found');
  }
  return res.status(200).json(layer);
}

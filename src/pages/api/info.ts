import { NextApiResponse } from 'next';
import { general } from '../../data/general';

export default function handler(response: NextApiResponse) {
  response.status(200).json(general);
}

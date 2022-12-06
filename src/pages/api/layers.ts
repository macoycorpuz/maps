import { NextApiResponse } from 'next';
import { data } from '../../data';

export default function handler(response: NextApiResponse) {
  response.status(200).json(data);
}

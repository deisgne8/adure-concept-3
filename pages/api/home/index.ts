import type { NextApiRequest, NextApiResponse } from "next";
import { loadHomeContent } from "../../../lib/home/load-home-content";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const homeContent = await loadHomeContent();

  res.status(200).json(homeContent);
}

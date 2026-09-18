import type { NextApiRequest, NextApiResponse } from "next";
import conversation from "../../../data/home/conversation.json";
import discovery from "../../../data/home/discovery.json";
import hero from "../../../data/home/hero.json";
import journeys from "../../../data/home/journeys.json";
import management from "../../../data/home/management.json";
import portfolio from "../../../data/home/portfolio.json";
import proof from "../../../data/home/proof.json";
import sell from "../../../data/home/sell.json";
import site from "../../../data/home/site.json";
import transition from "../../../data/home/transition.json";
import trust from "../../../data/home/trust.json";

const contentBySection = {
  site,
  hero,
  journeys,
  discovery,
  management,
  proof,
  portfolio,
  transition,
  sell,
  trust,
  conversation,
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { section } = req.query;

  if (typeof section !== "string" || !(section in contentBySection)) {
    return res.status(404).json({ error: "Unknown home section" });
  }

  return res.status(200).json(
    contentBySection[section as keyof typeof contentBySection],
  );
}

import type { Article } from "@/lib/content/schema";
import { accountArticles } from "./accounts";
import { adelphiSystemArticles } from "./adelphi-systems";
import { browserAccountArticles } from "./browser-accounts";
import { connectivityArticles } from "./connectivity";
import { operationsArticles } from "./operations";
import { printingArticles } from "./printing";

export const articles: Article[] = [
  ...accountArticles,
  ...adelphiSystemArticles,
  ...browserAccountArticles,
  ...connectivityArticles,
  ...printingArticles,
  ...operationsArticles,
];

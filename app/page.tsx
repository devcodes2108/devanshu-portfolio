import { PortfolioShell } from "@/components/portfolio-shell";
import { getGitHubRepos } from "@/lib/github";

export default async function Home() {
  const githubRepos = await getGitHubRepos();

  return <PortfolioShell githubRepos={githubRepos} />;
}

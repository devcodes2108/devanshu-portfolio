export type GitHubRepoSummary = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

export async function getGitHubRepos(): Promise<GitHubRepoSummary[]> {
  const endpoint = "https://api.github.com/users/devcodes2108/repos?sort=updated&per_page=6";

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const repositories = (await response.json()) as Array<{
      name: string;
      description: string | null;
      html_url: string;
      homepage: string | null;
      language: string | null;
      topics?: string[];
      stargazers_count: number;
      forks_count: number;
      updated_at: string;
    }>;

    return repositories
      .filter((repository) => !repository.name.startsWith("."))
      .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
      .slice(0, 6)
      .map((repository) => ({
        name: repository.name,
        description: repository.description,
        html_url: repository.html_url,
        homepage: repository.homepage,
        language: repository.language,
        topics: repository.topics ?? [],
        stargazers_count: repository.stargazers_count,
        forks_count: repository.forks_count,
        updated_at: repository.updated_at,
      }));
  } catch {
    return [];
  }
}

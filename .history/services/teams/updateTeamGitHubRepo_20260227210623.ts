export const updateTeamGitHubRepo = async (githubRepo: string) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch('/api/team/update-github', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ github_repo: githubRepo }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update GitHub repository');
  }

  return data.team;
};

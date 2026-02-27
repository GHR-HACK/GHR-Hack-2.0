'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Container from '@/components/ui/Container';
import Title from '@/components/ui/Title';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateTeamGitHubRepo } from '@/services/teams/updateTeamGitHubRepo';

export default function ProjectSubmissionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [githubUrl, setGithubUrl] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Get current user
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { getSupabaseBrowserClient } = await import('@/lib/supabase/client');
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
  });

  // Get team profile
  const { data: teamProfile, isLoading: teamLoading } = useQuery({
    queryKey: ['teamProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { getTeamProfile } = await import('@/services/teams/getTeamProfile');
      return getTeamProfile(user.id);
    },
    enabled: !!user?.id,
  });

  // Load existing github repo if available
  useEffect(() => {
    if (teamProfile?.github_repo) {
      setGithubUrl(teamProfile.github_repo);
    }
  }, [teamProfile]);

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!teamProfile?.team_id) throw new Error('Team not found');
      if (!githubUrl.trim()) throw new Error('GitHub URL is required');

      // Basic validation
      if (!githubUrl.includes('github.com')) {
        throw new Error('Please enter a valid GitHub repository URL');
      }

      return updateTeamGitHubRepo(teamProfile.team_id, githubUrl.trim());
    },
    onSuccess: () => {
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['teamProfile', user?.id] });
      setTimeout(() => {
        router.push('/select-ps');
      }, 2000);
    },
    onError: (error: any) => {
      alert(`Error: ${error.message}`);
    },
  });

  const isLoading = userLoading || teamLoading;

  if (!user && !userLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <Container size="sm">
          <div className="text-center">
            <Title level={2} variant="gradient" size="lg" className="mb-4">
              Please Login First
            </Title>
            <p className="text-black/70 mb-6">You need to be logged in to submit a project.</p>
            <Button onClick={() => router.push('/team-login')} variant="primary" size="lg">
              Go to Login
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-10 h-10 border-4 border-primary-purple border-t-primary-orange rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-black/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-black/10 z-50">
        <div className="px-4 py-4">
          <Container size="xl">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary-purple">Submit Project</h1>
              <Button
                onClick={() => router.push('/select-ps')}
                variant="secondary"
                size="sm"
                className="bg-black/10 hover:bg-black/20 text-black"
              >
                Back
              </Button>
            </div>
          </Container>
        </div>
      </div>

      <div className="px-4 pb-16 pt-32">
        <Container size="md">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-8 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-700 font-semibold">✅ Project submitted successfully!</p>
                <p className="text-sm text-green-600">Redirecting back to Problem Statements...</p>
              </div>
            )}

            {/* Form Card */}
            <Card variant="gradient" padding="lg" className="mb-8">
              {/* Header */}
              <div className="text-center mb-8">
                <Title level={2} variant="gradient" size="lg" align="center" className="mb-2">
                  Submit Your Project
                </Title>
                <p className="text-black/70">
                  Submit your GitHub repository link for the hackathon project.
                </p>
              </div>

              {/* Team Info */}
              <div className="bg-primary-purple/10 p-4 rounded-lg mb-6">
                <h3 className="font-bold text-black mb-2">Team Information</h3>
                <p className="text-sm text-black/70">
                  <span className="font-semibold">Team Leader:</span> {teamProfile?.team_leader_name}
                </p>
                <p className="text-sm text-black/70">
                  <span className="font-semibold">Email:</span> {teamProfile?.team_leader_email}
                </p>
                <p className="text-sm text-black/70">
                  <span className="font-semibold">College:</span> {teamProfile?.college}
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitMutation.mutate();
                }}
                className="space-y-6"
              >
                {/* GitHub URL Input */}
                <div>
                  <label htmlFor="github-url" className="block text-sm font-semibold text-black/80 mb-2">
                    GitHub Repository URL *
                  </label>
                  <Input
                    id="github-url"
                    type="url"
                    placeholder="https://github.com/username/project-name"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full rounded-xl border-black/15 bg-white text-black placeholder-black/40 focus:ring-primary-purple"
                    required
                    disabled={submitMutation.isPending}
                  />
                  <p className="text-xs text-black/60 mt-2">
                    Enter the complete GitHub repository URL for your hackathon project.
                  </p>
                </div>

                {/* Helper Text */}
                <div className="bg-primary-orange/10 p-4 rounded-lg border border-primary-orange/20">
                  <p className="text-sm text-black/70">
                    <span className="font-semibold text-primary-orange">📝 Tip:</span> Make sure your repository is accessible and contains your project code.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={submitMutation.isPending || !githubUrl.trim()}
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Project'}
                </Button>
              </form>
            </Card>

            {/* Info Box */}
            <div className="p-4 bg-black/5 rounded-lg border border-black/10">
              <h4 className="font-bold text-black mb-2">What happens next?</h4>
              <ul className="text-sm text-black/70 space-y-1">
                <li>✓ Your repository link will be saved to your team profile</li>
                <li>✓ Judges will access your project from the provided link</li>
                <li>✓ You can update this link anytime before the submission deadline</li>
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

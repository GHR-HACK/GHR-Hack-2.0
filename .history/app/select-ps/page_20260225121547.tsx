'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Container from '@/components/ui/Container';
import Title from '@/components/ui/Title';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { getProblemStatements } from '@/services/problem-statements/getProblemStatements';
import { selectProblemStatement } from '@/services/ps-selections/selectProblemStatement';
import { getPSCounts } from '@/services/ps-selections/getPSCounts';
import { getTeamProfile } from '@/services/teams/getTeamProfile';
import { logout } from '@/services/auth/loginWithCredentials';
import type { ProblemStatement } from '@/services/types/database';

export default function SelectPSPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [teamName, setTeamName] = useState<string>('');
  const [currentSelectedPs, setCurrentSelectedPs] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [psToConfirm, setPsToConfirm] = useState<ProblemStatement | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load team info from localStorage on mount
  useEffect(() => {
    const storedTeamName = localStorage.getItem('team_name');
    if (!storedTeamName) {
      router.push('/team-login');
      return;
    }
    setTeamName(storedTeamName);
  }, [router]);

  // Get team profile (includes already selected PS)
  const { data: teamProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['teamProfile'],
    queryFn: getTeamProfile,
    retry: 1,
  });

  // Update currentSelectedPs when team profile loads
  useEffect(() => {
    if (teamProfile?.selected_ps) {
      setCurrentSelectedPs(teamProfile.selected_ps);
      console.log('✅ Team already has selected PS:', teamProfile.selected_ps);
    }
  }, [teamProfile]);

  // Get all problem statements
  const { data: problemStatements, isLoading: psLoading } = useQuery({
    queryKey: ['problemStatements'],
    queryFn: getProblemStatements,
  });

  // Get REAL PS team counts from API
  const { data: psTeamCounts = {}, isLoading: countsLoading } = useQuery({
    queryKey: ['psTeamCounts'],
    queryFn: getPSCounts,
    refetchInterval: 5000, // Refresh counts every 5 seconds for real-time updates
  });

  // Select PS mutation with FCFS handled on backend
  const selectMutation = useMutation({
    mutationFn: async (psId: string) => {
      return selectProblemStatement(psId);
    },
    onSuccess: (data) => {
      setCurrentSelectedPs(data.team.selected_ps);
      setDialogOpen(false);
      setPsToConfirm(null);
      setSuccessMessage(`Problem Statement selected successfully!`);
      setSuccessDialogOpen(true);
      queryClient.invalidateQueries({ queryKey: ['psTeamCounts'] });
      queryClient.invalidateQueries({ queryKey: ['teamProfile'] });
    },
    onError: (error: any) => {
      const errorMsg = error.message || 'An error occurred';
      alert(`❌ Selection Failed:\n\n${errorMsg}`);
      setDialogOpen(false);
      setPsToConfirm(null);
      // Refresh counts after failed attempt
      queryClient.invalidateQueries({ queryKey: ['psTeamCounts'] });
    },
  });

  const handleSelectPS = (ps: ProblemStatement) => {
    setPsToConfirm(ps);
    setDialogOpen(true);
  };

  const handleConfirmSelection = () => {
    if (psToConfirm) {
      selectMutation.mutate(psToConfirm.id);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/team-login');
  };

  const isLoading = psLoading || countsLoading || profileLoading;
  const alreadySelected = !!currentSelectedPs;

  // Extract unique domains from problem statements - safely handle undefined
  const domains = problemStatements 
    ? ['All', ...Array.from(new Set(problemStatements.map(ps => ps.domain)))]
    : ['All'];

  // Filter PS by selected domain - safely handle undefined
  const filteredPS = problemStatements 
    ? (selectedDomain === 'All' 
        ? problemStatements 
        : problemStatements.filter(ps => ps.domain === selectedDomain))
    : [];

  if (!teamName && !isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <Container size="sm">
          <div className="text-center">
            <Title level={2} variant="gradient" size="lg" className="mb-4">
              Please Login First
            </Title>
            <p className="text-black/70 mb-6">You need to log in to select a problem statement.</p>
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
          <p className="mt-4 text-black/70">Loading problem statements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-4 pb-16 pt-28">
        <Container size="xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <Title level={1} variant="gradient" size="xl" align="left" className="mb-2">
                  Select Problem Statement
                </Title>
              </div>
              <Button
                onClick={handleLogout}
                variant="primary"
                size="md"
                className="whitespace-nowrap"
              >
                Logout
              </Button>
            </div>
            <p className="text-lg text-black/70 font-red-hat-display max-w-2xl">
              Welcome, {teamName}! Choose one problem statement for your team.
              <br />
              <span className="text-sm text-primary-purple font-semibold">
                {alreadySelected ? '✓ You have already selected a PS' : 'Each team can select only ONE PS. FCFS applies!'}
              </span>
            </p>
          </div>

          {/* Domain Tabs */}
          <div className="mb-8 flex items-center justify-center">
            <div className="inline-flex flex-wrap gap-2 p-2 bg-white border-2 border-black/10 rounded-2xl shadow-sm">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`
                    px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
                    ${selectedDomain === domain 
                      ? 'bg-gradient-to-r from-primary-purple to-primary-orange text-white shadow-md' 
                      : 'bg-white text-black/70 hover:bg-black/5 hover:text-black'
                    }
                  `}
                >
                  {domain}
                  {domain !== 'All' && (
                    <span className={`ml-2 ${selectedDomain === domain ? 'text-white/80' : 'text-black/50'}`}>
                      ({problemStatements?.filter(ps => ps.domain === domain).length || 0})
                    </span>
                  )}
                  {domain === 'All' && (
                    <span className={`ml-2 ${selectedDomain === domain ? 'text-white/80' : 'text-black/50'}`}>
                      ({problemStatements?.length || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Statements Grid - 2 columns on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {filteredPS.map((ps) => {
              const teamCount = psTeamCounts[ps.id] || 0;
              const isFull = teamCount >= 3;
              const isSelected = currentSelectedPs === ps.id;

              return (
                <Card key={ps.id} variant="gradient" padding="lg" className="relative">
                  {/* Full Badge */}
                  {isFull && !isSelected && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white py-1 px-3 rounded-full text-sm font-semibold">
                      Full
                    </div>
                  )}

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-primary-purple text-white py-1 px-3 rounded-full text-sm font-semibold">
                      ✓ Your Selection
                    </div>
                  )}

                  {/* PS Content */}
                  <div className="mb-6">
                    {/* Domain & Slot Info */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-primary-purple/20 text-primary-purple rounded-full text-xs font-semibold">
                        {ps.domain}
                      </span>
                      <span className="text-sm font-semibold text-black/60">
                        {teamCount}/3 Teams Selected
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-black mb-3">{ps.title}</h3>

                    {/* Description */}
                    <p className="text-black/70 text-sm leading-relaxed mb-4">{ps.description}</p>

                    {/* Expected Outcomes */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-black mb-2">Expected Outcomes:</h4>
                      <ul className="space-y-1">
                        {(ps.expected_outcomes || []).map((outcome, idx) => (
                          <li key={idx} className="text-sm text-black/70 flex items-start">
                            <span className="text-primary-orange mr-2 font-bold">•</span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Constraints */}
                    <div className="mb-4">
                      <h4 className="text-sm font-bold text-black mb-2">Key Constraints:</h4>
                      <ul className="space-y-1">
                        {(ps.key_constraints || []).map((constraint, idx) => (
                          <li key={idx} className="text-sm text-black/70 flex items-start">
                            <span className="text-primary-orange mr-2 font-bold">•</span>
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isSelected ? (
                      <div className="w-full py-3 px-4 bg-primary-purple/20 text-primary-purple rounded-lg font-semibold text-center">
                        Selected
                      </div>
                    ) : alreadySelected ? (
                      <div className="w-full py-3 px-4 bg-black/10 text-black/50 rounded-lg font-semibold text-center cursor-not-allowed">
                        Change Not Allowed
                      </div>
                    ) : isFull ? (
                      <div className="w-full py-3 px-4 bg-red-100 text-red-700 rounded-lg font-semibold text-center cursor-not-allowed">
                        This PS is Full
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleSelectPS(ps)}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        disabled={selectMutation.isPending}
                      >
                        {selectMutation.isPending ? 'Selecting...' : 'Select This PS'}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* No PS Available or No Filtered Results */}
          {(!problemStatements || problemStatements.length === 0) && (
            <div className="text-center py-12">
              <Title level={3} variant="gradient" className="mb-2">
                No Problem Statements Available
              </Title>
              <p className="text-black/70">Check back later for available problem statements.</p>
            </div>
          )}

          {problemStatements && problemStatements.length > 0 && filteredPS.length === 0 && (
            <div className="text-center py-12">
              <Title level={3} variant="gradient" className="mb-2">
                No Problem Statements in {selectedDomain}
              </Title>
              <p className="text-black/70">Try selecting a different domain.</p>
            </div>
          )}
        </Container>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Confirm Problem Statement Selection"
        confirmText="Yes, Select This PS"
        cancelText="Cancel"
        onConfirm={handleConfirmSelection}
        isLoading={selectMutation.isPending}
      >
        <div className="space-y-4">
          {psToConfirm && (
            <>
              <div className="bg-primary-purple/10 p-4 rounded-lg">
                <h3 className="font-bold text-black mb-2">{psToConfirm.title}</h3>
                <p className="text-sm text-black/70 mb-3">{psToConfirm.description}</p>
                <div className="inline-block px-3 py-1 bg-primary-purple/20 text-primary-purple rounded-full text-xs font-semibold">
                  {psToConfirm.domain}
                </div>
              </div>
              <p className="text-sm text-black/70">
                Are you sure you want to select this problem statement? Once selected, you cannot change your choice.
              </p>
            </>
          )}
        </div>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        title="Selection Successful!"
        confirmText="Done"
        cancelText=""
        onConfirm={() => setSuccessDialogOpen(false)}
      >
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-green-700 font-semibold mb-2">{successMessage}</p>
            <p className="text-sm text-black/70">Your problem statement has been locked in. Good luck at the hackathon!</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
}


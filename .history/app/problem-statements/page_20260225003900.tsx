'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Container from '@/components/ui/Container';
import Title from '@/components/ui/Title';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getProblemStatements } from '@/services/problem-statements/getProblemStatements';
import { getPSCounts } from '@/services/ps-selections/getPSCounts';
import type { ProblemStatement } from '@/services/types/database';

export default function ProblemStatementsPage() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  // Get all problem statements
  const { data: problemStatements, isLoading: psLoading } = useQuery({
    queryKey: ['problemStatements'],
    queryFn: getProblemStatements,
  });

  // Get PS team counts
  const { data: psTeamCounts = {}, isLoading: countsLoading } = useQuery({
    queryKey: ['psTeamCounts'],
    queryFn: getPSCounts,
    refetchInterval: 5000, // Refresh counts every 5 seconds
  });

  const isLoading = psLoading || countsLoading;

  // Extract unique domains from problem statements
  const domains = problemStatements 
    ? ['All', ...Array.from(new Set(problemStatements.map(ps => ps.domain)))]
    : ['All'];

  // Filter PS by selected domain
  const filteredPS = problemStatements 
    ? (selectedDomain === 'All' 
        ? problemStatements 
        : problemStatements.filter(ps => ps.domain === selectedDomain))
    : [];

  // Check if user is already logged in
  const handleTeamLoginClick = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // User is already logged in, redirect to select-ps page
      router.push('/select-ps');
    } else {
      // User not logged in, redirect to team-login page
      router.push('/team-login');
    }
  };

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
          {/* Header with Team Login Button */}
          <div className="text-center mb-8 relative">
            {/* Team Login Button - Top Right */}
            <div className="absolute top-0 right-0">
              <Button 
                onClick={handleTeamLoginClick}
                variant="primary"
                size="md"
                className="shadow-lg"
              >
                Team Login
              </Button>
            </div>

            <Title level={1} variant="gradient" size="xl" align="center" className="mb-2">
              Problem Statements
            </Title>
            <p className="text-lg text-black/70 font-red-hat-display max-w-2xl mx-auto">
              Explore all available problem statements across different domains.
              <br />
              <span className="text-sm text-primary-purple font-semibold">
                Click "Team Login" to select your problem statement
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

              return (
                <Card key={ps.id} variant="gradient" padding="lg" className="relative">
                  {/* PS Content */}
                  <div className="mb-6">
                    {/* Domain & Slot Info */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-primary-purple/20 text-primary-purple rounded-full text-xs font-semibold">
                        {ps.domain}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-black mb-3">{ps.title}</h3>

                    {/* Description */}
                    <p className="text-black/70 text-sm leading-relaxed mb-4">{ps.description}</p>

                    {/* Expected Outcomes */}
                    {ps.expected_outcomes && ps.expected_outcomes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-black mb-2">Expected Outcomes:</h4>
                        <ul className="space-y-1">
                          {ps.expected_outcomes.map((outcome, idx) => (
                            <li key={idx} className="text-sm text-black/70 flex items-start">
                              <span className="text-primary-orange mr-2 font-bold">•</span>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Constraints */}
                    {ps.key_constraints && ps.key_constraints.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-black mb-2">Key Constraints:</h4>
                        <ul className="space-y-1">
                          {ps.key_constraints.map((constraint, idx) => (
                            <li key={idx} className="text-sm text-black/70 flex items-start">
                              <span className="text-primary-orange mr-2 font-bold">•</span>
                              <span>{constraint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
    </div>
  );
}

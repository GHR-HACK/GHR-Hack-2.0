"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Input } from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Title from "@/components/ui/Title";
import Container from "@/components/ui/Container";
import { shortlistedTeams } from "@/data/shortlisted-teams";

gsap.registerPlugin(ScrollTrigger);

const hasTeams = Object.keys(shortlistedTeams).length > 0;

export default function ShortlistedTeamsPage() {
  const [query, setQuery] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const teams = useMemo(() => Object.values(shortlistedTeams), []);
  
  const filteredTeams = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return teams;
    }
    const normalizedQuery = trimmedQuery.toLowerCase();
    return teams.filter((team) => {
      return (
        team.teamName.toLowerCase().includes(normalizedQuery) ||
        team.college.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, teams]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-card', {
        scrollTrigger: {
          trigger: '.teams-grid',
          start: 'top 80%',
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        clearProps: 'all',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredTeams]);

  return (
    <div ref={sectionRef} className="bg-white text-slate-900 min-h-screen">
      <div className="px-4 py-10 mt-20">
        <Container>
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-8">
              <Title level={2} variant="gradient" size="xl" className="mb-4">
                Shortlisted Teams
              </Title>
              <p className="text-slate-600 font-red-hat-display">
                Congratulations to all the selected teams!
              </p>
            </div>

            <div className="mb-8 max-w-2xl mx-auto">
              <label className="sr-only" htmlFor="team-search">
                Search teams
              </label>
              <Input
                id="team-search"
                placeholder="Search by team name or college"
                className="bg-white text-slate-900 border-slate-300"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {hasTeams ? (
              <>
                {filteredTeams.length > 0 ? (
                  <div className="teams-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team, index) => (
                      <Card
                        key={team.teamName}
                        variant="glass"
                        className="team-card group hover:shadow-xl transition-all duration-300"
                        style={{ willChange: 'transform, opacity' }}
                      >
                        <div className="p-6">
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-red-hat-display font-semibold text-primary-orange uppercase tracking-wide">
                                Team
                              </span>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-orange to-primary-purple flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                            </div>
                            <h3 className="text-xl font-red-hat-display font-bold text-black group-hover:gradient-text transition-all duration-300">
                              {team.teamName}
                            </h3>
                          </div>

                          <div className="space-y-3 border-t border-black/10 pt-4">
                            <div className="flex items-start gap-2">
                              <div className="w-20 flex-shrink-0">
                                <span className="text-xs font-red-hat-display font-semibold text-slate-500 uppercase">
                                  College
                                </span>
                              </div>
                              <p className="text-sm font-red-hat-display text-black/80 flex-1 break-words leading-tight">
                                {team.college}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="max-w-md mx-auto">
                    <Card variant="glass" className="text-center">
                      <div className="p-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-red-hat-display font-bold text-black mb-2">
                          No results found
                        </h3>
                        <p className="text-slate-600 font-red-hat-display text-sm">
                          Try searching with a different team name or college
                        </p>
                      </div>
                    </Card>
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-md mx-auto">
                <Card variant="glass" className="text-center">
                  <div className="p-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-orange/20 to-primary-pink/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-red-hat-display font-bold text-black mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-slate-600 font-red-hat-display text-sm">
                      Shortlisted teams will appear here soon
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
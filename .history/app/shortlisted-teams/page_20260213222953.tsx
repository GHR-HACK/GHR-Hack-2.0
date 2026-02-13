"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Input } from "@/components/ui/Input";
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
    if (!trimmedQuery) return teams;
    const normalizedQuery = trimmedQuery.toLowerCase();
    return teams.filter((team) =>
      team.teamName.toLowerCase().includes(normalizedQuery) ||
      team.college.toLowerCase().includes(normalizedQuery)
    );
  }, [query, teams]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".table-row", {
        scrollTrigger: {
          trigger: ".teams-table",
          start: "top 80%",
          once: true,
        },
        y: 10,
        opacity: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: "power2.out",
        clearProps: "all",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredTeams]);

  return (
    <div ref={sectionRef} className="bg-white text-slate-900 min-h-screen">
      <div className="px-4 py-10 mt-20">
        <Container>
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
              <Title level={2} variant="gradient" size="xl" className="mb-4">
                Shortlisted Teams
              </Title>
              <p className="text-slate-600 font-red-hat-display">
                Congratulations to all the selected teams!
              </p>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-full">
              <label className="sr-only" htmlFor="team-search">
                Search teams
              </label>
              <Input
                id="team-search"
                placeholder="Search by team name or college"
                className="!rounded-full bg-white text-slate-900 border-slate-300"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {hasTeams ? (
              <>
                {filteredTeams.length > 0 ? (
                  /* ── Responsive table wrapper ── */
                  <div className="w-full overflow-x-auto rounded-2xl border border-black/10 shadow-sm">
                    <table className="teams-table w-full min-w-[600px] border-collapse text-sm font-red-hat-display">
                      <thead>
                        <tr className="bg-gradient-to-r from-primary-orange/10 to-primary-purple/10 border-b border-black/10">
                          <th className="py-4 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-12">
                            Sr. No
                          </th>
                          <th className="py-4 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Team Name
                          </th>
                          <th className="py-4 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Members
                          </th>
                          <th className="py-4 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            College
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeams.map((team, index) => (
                          <tr
                            key={team.teamName}
                            className="table-row border-b border-black/5 last:border-0 hover:bg-slate-50 transition-colors duration-150"
                          >
                            {/* Index */}
                            <td className="py-4 px-4 text-slate-400 font-semibold text-sm">
                              {index + 1}
                            </td>

                            {/* Team Name */}
                            <td className="py-4 px-4">
                              <span className="font-bold text-black text-base">
                                {team.teamName}
                              </span>
                            </td>

                            {/* Members */}
                            <td className="py-4 px-4">
                              <span className="text-black/70 leading-relaxed">
                                {team.members.join(", ")}
                              </span>
                            </td>

                            {/* College */}
                            <td className="py-4 px-4">
                              <span className="text-black/70 leading-relaxed">
                                {team.college}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* No results */
                  <div className="max-w-md mx-auto text-center rounded-2xl border border-black/10 p-12">
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
                )}
              </>
            ) : (
              /* Coming soon */
              <div className="max-w-md mx-auto text-center rounded-2xl border border-black/10 p-12">
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
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
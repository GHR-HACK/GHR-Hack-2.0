"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortlistedTeams } from "@/data/shortlisted-teams";

const hasTeams = Object.keys(shortlistedTeams).length > 0;

export default function ShortlistedTeamsPage() {
  const [query, setQuery] = useState("");
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

  return (
    <div className="bg-white text-slate-900">

      <div className="px-4 py-10 mt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
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
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {filteredTeams.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Track
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeams.map((team) => (
                        <TableRow key={team.teamName}>
                          <TableCell className="font-medium">
                            {team.teamName}
                          </TableCell>
                          <TableCell>{team.college}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {team.track}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="px-6 py-10 text-center text-slate-600">
                  No results found.
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
              Shortlisted Teams will appear here soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

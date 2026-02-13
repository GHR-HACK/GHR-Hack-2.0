import Image from "next/image";

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
  return (
    <div className="bg-white text-slate-900">
      <div className="relative  h-48 w-full sm:h-64 md:h-72 lg:h-80">
        <Image
          src="/cyber.png"
          alt="Shortlisted teams banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-4 pb-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
              Shortlisted Teams
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-10 sm:px-6 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <label className="sr-only" htmlFor="team-search">
              Search teams
            </label>
            <Input
              id="team-search"
              placeholder="Search by team name or college"
              className="bg-white text-slate-900 border-slate-300"
            />
          </div>

          {hasTeams ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead className="hidden sm:table-cell">Track</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.values(shortlistedTeams).map((team) => (
                    <TableRow key={team.teamName}>
                      <TableCell className="font-medium">
                        {team.teamName}
                      </TableCell>
                      <TableCell>{team.college}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {team.track}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {team.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

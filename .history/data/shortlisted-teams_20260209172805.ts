export type ShortlistedTeam = {
	teamName: string;
	college: string;
	track: string;
	status: string;
};

export const shortlistedTeams: Record<string, ShortlistedTeam> = {
	"team-1": {
		teamName: "Quantum Coders",
		college: "GHRCE",
		track: "AI + Health",
		status: "Shortlisted",
	},
	"team-2": {
		teamName: "Byte Builders",
		college: "Raisoni University",
		track: "FinTech",
		status: "Shortlisted",
	},
	"team-3": {
		teamName: "Nova Stack",
		college: "VNIT",
		track: "Smart City",
		status: "Shortlisted",
	},
};

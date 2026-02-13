export type ShortlistedTeam = {
	teamName: string;
	college: string;
};

export const shortlistedTeams: Record<string, ShortlistedTeam> = {
	"team-1": {
		teamName: "Quantum Coders",
		college: "G H Raisoni College of Engineering",
	},
	"team-2": {
		teamName: "Byte Builders",
		college: "Raisoni University",
	},
	"team-3": {
		teamName: "Nova Stack",
		college: "Visvesvaraya National Institute of Technology",
	},
};

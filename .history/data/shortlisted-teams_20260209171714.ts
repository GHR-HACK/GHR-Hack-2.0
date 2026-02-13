export type ShortlistedTeam = {
	teamName: string;
	college: string;
	track: string;
	status: string;
};

export const shortlistedTeams: Record<string, ShortlistedTeam> = {};

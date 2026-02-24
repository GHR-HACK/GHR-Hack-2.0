import { loginWithEmailPassword } from './loginWithEmailPassword';
import { getTeamByLeaderEmail } from '@/services/teams/getTeamByLeaderEmail';

export const completeTeamLoginWithPassword = async (email: string, password: string) => {
  await loginWithEmailPassword(email, password);

  const team = await getTeamByLeaderEmail(email);

  if (!team) {
    throw new Error('Team profile not found. Please contact support.');
  }

  return team;
};

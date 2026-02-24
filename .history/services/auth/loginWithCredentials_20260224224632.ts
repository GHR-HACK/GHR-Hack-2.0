export interface LoginResponse {
  success: boolean;
  token: string;
  team: {
    id: string;
    name: string;
    leader_email: string;
    selected_ps: string | null;
  };
}

export const loginWithCredentials = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('🔐 Attempting login with email:', email);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Login failed:', errorData);
      throw new Error(errorData.error || `Login failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Login successful!');

    // Store token in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('team_id', data.team.id);
    localStorage.setItem('team_name', data.team.name);

    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('🔥 Login Exception:', errorMsg);
    throw error;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('team_id');
  localStorage.removeItem('team_name');
  console.log('✅ Logged out successfully');
};

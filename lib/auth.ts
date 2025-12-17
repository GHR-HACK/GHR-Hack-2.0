// Simple authentication utilities
// In a production app, use proper JWT tokens and secure authentication

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Use environment variable in production

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function setAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_authenticated', 'true');
    localStorage.setItem('admin_login_time', Date.now().toString());
  }
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_login_time');
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const authenticated = localStorage.getItem('admin_authenticated');
  const loginTime = localStorage.getItem('admin_login_time');

  if (!authenticated || !loginTime) return false;

  // Check if session is still valid (24 hours)
  const timeDiff = Date.now() - parseInt(loginTime);
  const maxSessionTime = 24 * 60 * 60 * 1000; // 24 hours

  if (timeDiff > maxSessionTime) {
    clearAdminSession();
    return false;
  }

  return true;
}

# Supabase Setup Guide

## 1. Run Schema in Supabase Console

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the entire content of `supabase/schema.sql`
4. Run the script

This will:
- Create 3 tables: `problem_statements`, `teams`, `ps_selections`
- Set up the trigger to enforce 2-team limit per PS
- Configure RLS policies
- Insert sample PS-X1

## 2. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from: Supabase Dashboard → Settings → API

## 3. Install Dependencies

```bash
pnpm install
```

This will install `@supabase/supabase-js`.

## 4. Test the Flow

1. Start dev server: `pnpm dev`
2. Go to `/problem-statements`
3. Click "Login"
4. Enter team email (must exist in Supabase Auth)
5. Check email for OTP
6. Enter OTP and verify
7. Select a PS (shows remaining slots dynamically)
8. Try selecting another PS (should show "Already Selected")

## Authentication Flow

### Current Implementation (For Testing)
- Teams log in with **email + OTP** (Supabase Magic Link)
- On successful login, a team profile is auto-created in `teams` table
- Team can then select one PS (enforced at DB level)

### Production Flow (Your Script)
You mentioned you'll have a script that:
- Pre-populates `auth.users` table with team emails
- Pre-populates `teams` table with team details

**That's perfect.** The current login flow will work with those pre-existing teams:
1. Team enters their pre-registered email
2. Supabase sends OTP
3. Team verifies OTP
4. System looks up their existing team profile (via `user_id`)
5. Team can select a PS

## Service Layer Structure

All functions follow single responsibility:

```
services/
├── auth/
│   ├── sendOtp.ts              # Send OTP email
│   ├── verifyOtp.ts            # Verify OTP token
│   ├── completeTeamLogin.ts    # Full login flow
│   ├── getCurrentUser.ts       # Get current auth user
│   └── signOut.ts              # Sign out
├── problem-statements/
│   ├── types.ts                # TypeScript types
│   ├── getProblemStatements.ts # Fetch all PS
│   └── groupByTheme.ts         # Group PS by theme
├── teams/
│   ├── ensureTeamProfile.ts    # Create/update team profile
│   ├── getTeamProfile.ts       # Get team by user_id
│   └── updateTeamProfile.ts    # Update team details
└── ps-selections/
    ├── createSelection.ts      # Select a PS
    ├── deleteSelection.ts      # Deselect a PS
    ├── getTeamSelection.ts     # Get team's selection
    └── getPSSelectionCount.ts  # Count selections per PS
```

## Custom Hooks (TanStack Query)

```
lib/hooks/
├── useAuth.ts             # useCurrentUser
├── useTeam.ts             # useTeamProfile, useUpdateTeamProfile
└── usePSSelection.ts      # useCreateSelection, useTeamSelection, etc.
```

All use TanStack Query mutations and queries. **Zero useEffect**.

## Database Security

- **Row Level Security (RLS)** enabled on all tables
- Problem statements are public (anyone can view)
- Teams can only view/edit their own profile
- Teams can only select PS if authenticated and profile exists
- Trigger prevents >2 teams per PS

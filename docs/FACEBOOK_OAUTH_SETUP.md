# Facebook OAuth Setup Checklist

Use this document when the product owner provides access to a Meta for Developers account and the Facebook app credentials.

## Current status

- The frontend already uses the correct Supabase call: `signInWithOAuth({ provider: "facebook" })`.
- A non-interactive Supabase preflight generated a Facebook authorization URL on 2026-08-16. This confirms that the provider is enabled in Supabase, but it does **not** replace a real Facebook browser login test.
- A real end-to-end test is blocked until an authorized Meta developer account and a test Facebook account are available.

## Meta for Developers configuration

1. Create or open the BuzzCard Facebook app at Meta for Developers.
2. Add the **Facebook Login** product.
3. Open **Facebook Login → Settings**.
4. Copy the Facebook callback URL displayed in **Supabase → Authentication → Providers → Facebook**.
5. Add that exact value to **Valid OAuth Redirect URIs**. It has this format:

   ```text
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

   Do not add a trailing slash or use the frontend URL here.

6. In **Use cases → Authentication and account creation**, ensure both permissions are ready for testing:
   - `public_profile`
   - `email`
7. Complete the required Meta app details: App Domain, Privacy Policy URL, Terms URL, and data-deletion callback URL.
8. While the app is in Development mode, add each real tester under **App roles**. Non-testers cannot log in during this phase.

## Supabase configuration

1. Go to **Authentication → Providers → Facebook**.
2. Enable Facebook.
3. Paste the Meta **App ID** as Client ID and the Meta **App Secret** as Client Secret.
4. Save the provider settings.
5. Go to **Authentication → URL Configuration**.
6. Set the Site URL to the real production domain.
7. Add these redirect URLs (replace the production domain when it is known):

   ```text
   http://localhost:5173/auth
   https://<production-domain>/auth
   ```

The provider returns to `/auth` with a safe `returnTo` query. Signup then defaults to `/onboarding`; returning login defaults to `/dashboard`.

## End-to-end verification

1. Use a Facebook account with a confirmed email address and an assigned Meta tester role.
2. Open the app at `http://localhost:5173/auth`.
3. Select **Facebook** and approve the permissions request.
4. Confirm that signup reaches `/onboarding`, while returning login reaches `/dashboard`, with an authenticated Supabase session.
5. In Supabase, confirm that the auth user exists and no `profiles` row was created automatically.
6. Confirm `auth.users.raw_user_meta_data` contains the expected name and avatar information when Facebook supplies it.
7. Repeat with an existing BuzzCard account using the same verified email to confirm identity linking behaves safely.

## Security rules

- Never put the Meta App Secret in frontend code, `.env.local`, Git, support messages, or screenshots. It belongs only in Supabase's Facebook provider configuration.
- Request only `public_profile` and `email`.
- Keep Supabase **Confirm email** enabled; it is required for safe same-email identity linking.
- Keep the Meta app in Development mode until the full flow has passed testing. Switch it to Live only after the public legal URLs and app details are complete.
- If any test fails, record the exact Meta or Supabase error text before changing settings. The error distinguishes redirect mismatch, missing permissions, tester-role, and credential issues.

## Useful references

- [Supabase: Login with Facebook](https://supabase.com/docs/guides/auth/social-login/auth-facebook)
- [Supabase: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

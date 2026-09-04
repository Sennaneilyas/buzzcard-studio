# Magic Link Authentication Setup Checklist

Use this checklist when the product owner can provide credentials for a transactional email provider.

## Why this is deferred

The Supabase built-in email service is only intended for demos and early testing. It has strict delivery restrictions and can return an `email rate limit exceeded` error. It should not be used for BuzzCard's real Magic Link sign-in flow.

## Prerequisites

- Product-owner approval for a transactional email provider, such as Resend, Amazon SES, or Postmark.
- Access to the provider account and DNS records for the sender domain.
- Access to the BuzzCard Supabase project dashboard.
- A production BuzzCard domain before launch.

## Configure the email provider

1. Create the transactional-email provider account.
2. Verify the sender domain, ideally `buzzcard.ma`.
3. Add the DNS records requested by the provider (usually SPF and DKIM).
4. Create SMTP credentials for the BuzzCard application.
5. Store those credentials in the password manager. Do not put them in frontend code, `.env.local`, Git, or screenshots.

## Configure Supabase

1. Go to **Authentication → Emails → SMTP Settings**.
2. Enable custom SMTP.
3. Enter the SMTP host, port, username, password, sender email, and sender name.
4. Save the configuration.
5. Go to **Authentication → URL Configuration**.
6. Set the Site URL to the production domain once it exists.
7. Add the exact post-authentication redirect URLs used by the app:

   ```text
   http://localhost:5173/auth
   https://<production-domain>/auth
   http://localhost:5173/auth/reset-password
   https://<production-domain>/auth/reset-password
   ```

8. Go to **Authentication → Email Templates → Magic Link**.
9. Ensure the template contains `{{ .ConfirmationURL }}`. This produces a magic link; `{{ .Token }}` would produce an email OTP instead.
10. Keep **Confirm email** enabled in Supabase Auth.

## Application behavior to preserve

- The client uses `supabase.auth.signInWithOtp()` for Magic Link delivery.
- The provider callback must use the allow-listed `/auth` URL. The client then applies the safe onboarding/dashboard destination.
- Signup with Magic Link must require acceptance of Terms and Privacy Policy.
- Passwordless signup must also require first and last name, then save
  `first_name`, `last_name`, and `full_name` in the new user's metadata.
- Existing users signing in by Magic Link must retain their stored metadata.
- Login mode should not silently create an account for an unknown email address (`shouldCreateUser: false`).
- Before enabling Magic Link in production, add a short resend cooldown in the UI to prevent accidental repeated requests. Supabase server-side limits remain the security boundary.

## Verify end to end

1. Open the app at `http://localhost:5173/auth`.
2. Request a Magic Link using a non-team email address.
3. Confirm the message arrives from the verified BuzzCard sender domain.
4. Click the link and verify signup reaches `/onboarding` with a valid session; verify returning login reaches `/dashboard`.
5. Confirm that the auth user exists and no `profiles` row is created until template setup begins.
6. Test an existing account to verify it signs in without creating a duplicate user.
7. Request a second link immediately and verify the UI and Supabase limit prevent unintended email bursts.

## Security rules

- Do not weaken or disable Supabase rate limits to work around test failures.
- Use a transactional sender only for authentication emails; keep marketing email separate.
- Disable link tracking in the SMTP provider for authentication messages because it can alter or consume single-use links.
- Keep the message brief and avoid inserting unsanitized user-provided data in email templates.
- Record the exact Supabase/Auth Logs error before changing configuration if a test fails.

## References

- [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Supabase rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Supabase signInWithOtp](https://supabase.com/docs/reference/javascript/auth-signinwithotp)

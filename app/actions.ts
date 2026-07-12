'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAuthActions } from '@insforge/sdk/ssr';
import { createInsForgeServerClient } from './lib/insforge/server';

// Helper to get app base URL
function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export async function signUpUser(prevState: any, formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const name = String(formData.get('name') || '').trim();

  if (!email || !password || !name) {
    return { error: 'All fields are required.' };
  }

  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const { data, error } = await auth.signUp({
    email,
    password,
    name,
    redirectTo: `${getAppUrl()}/login`
  });

  if (error) {
    return { error: error.message || 'Registration failed.' };
  }

  return {
    success: true,
    requireVerification: data?.requireEmailVerification || false,
    email,
    user: data?.user || null
  };
}

export async function signInUser(prevState: any, formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const { data, error } = await auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    if (error.statusCode === 403) {
      return { error: 'Email verification required.', requireVerification: true, email };
    }
    return { error: error.message || 'Invalid credentials.' };
  }

  redirect('/dashboard');
}

export async function verifyEmailOtp(prevState: any, formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const otp = String(formData.get('otp') || '').trim();

  if (!email || !otp) {
    return { error: 'Verification code is required.' };
  }

  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const { data, error } = await auth.verifyEmail({
    email,
    otp
  });

  if (error) {
    return { error: error.message || 'Invalid or expired verification code.' };
  }

  redirect('/dashboard');
}

export async function resendOtp(email: string) {
  if (!email) return { error: 'Email is required.' };

  const client = await createInsForgeServerClient();

  const { error } = await client.auth.resendVerificationEmail({
    email,
    redirectTo: `${getAppUrl()}/login`
  });

  if (error) {
    return { error: error.message || 'Failed to resend code.' };
  }

  return { success: true };
}

export async function handleSignOut() {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });
  await auth.signOut();
  redirect('/login');
}

export async function initiateOAuth(provider: string) {
  const cookieStore = await cookies();
  const auth = createAuthActions({ cookies: cookieStore });

  const { data, error } = await auth.signInWithOAuth(provider, {
    redirectTo: `${getAppUrl()}/api/auth/callback`,
    skipBrowserRedirect: true
  });

  if (error || !data?.url || !data?.codeVerifier) {
    throw new Error(error?.message || 'OAuth initialization failed.');
  }

  cookieStore.set('insforge_code_verifier', data.codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600
  });

  redirect(data.url);
}

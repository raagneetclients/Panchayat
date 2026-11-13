'use client';

import { FormEvent, useState } from 'react';
import { login, logout } from '@netlify/identity';

export function LoginForm({ returnTo }: { returnTo: string }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');

    try {
      await login(email, password);
      // A full navigation ensures the new Identity cookie is sent to the server.
      window.location.href = returnTo;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Sign in failed. Check your email and password.',
      );
      setBusy(false);
    }
  }

  return (
    <form className="bid-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Email / ईमेल <span>*</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="reviewer@example.org"
          />
        </label>
        <label>
          Password / पासवर्ड <span>*</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
      </div>
      {error && (
        <p role="alert">
          {error}
        </p>
      )}
      <button className="button" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in / साइन इन करें'}
      </button>
    </form>
  );
}

export function LogoutButton() {
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    try {
      await logout();
    } finally {
      window.location.href = '/hi/';
    }
  }

  return (
    <button className="button secondary" type="button" onClick={signOut} disabled={busy}>
      {busy ? 'Signing out…' : 'Sign out / साइन आउट'}
    </button>
  );
}

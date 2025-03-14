'use client';

import { Button }  from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <label htmlFor="password" className="text-sm font-medium text-gray-700 mt-2">Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-3"
            loading={isSubmitting}
          >
            Sign up
          </Button>
        </div>
      </form>
      <div className="space-y-2 mt-4">
        <p className="text-gray-700">Already have an account?</p>
        <p>
          <Link href="/signin/password_signin" className="text-sm text-navy hover:text-gold transition-colors">
            Sign in with email and password
          </Link>
        </p>
        {allowEmail && (
          <p>
            <Link href="/signin/email_signin" className="text-sm text-navy hover:text-gold transition-colors">
              Sign in via magic link
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

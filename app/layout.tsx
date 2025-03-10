import { Metadata } from 'next';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/ui/Navbar/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';

const title = 'LegalBridge - Case Management for Legal Professionals';
const description = 'Streamline your legal practice with our intuitive case management system.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main
          id="skip"
          className="flex-grow"
        >
          {children}
        </main>
        <Footer />
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}

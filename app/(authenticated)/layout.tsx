import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getUser } from '@/utils/supabase/queries';
import SidebarLayout from '@/components/layout/SidebarLayout';

export default async function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const user = await getUser(supabase);

  if (!user) {
    return redirect('/signin');
  }

  return <SidebarLayout user={user}>{children}</SidebarLayout>;
} 
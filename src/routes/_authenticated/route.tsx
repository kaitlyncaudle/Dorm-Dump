import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { rememberDestination } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated')({
  // The session lives in the browser, so this gate runs client-side only.
  ssr: false,
  beforeLoad: async ({ location }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      rememberDestination(location.href);
      throw redirect({ to: '/auth' });
    }
  },
  component: () => <Outlet />,
});

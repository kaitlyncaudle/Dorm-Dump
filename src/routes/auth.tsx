import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ArrowLeft, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleButton } from '@/components/google-button';
import { useAuth } from '@/lib/auth';

export const Route = createFileRoute('/auth')({
  head: () => ({
    meta: [
      { title: 'Sign in · Dorm Dump' },
      { name: 'description', content: 'Sign in with your Google account to save finds, message sellers, and list your own dorm essentials.' },
      { property: 'og:title', content: 'Sign in · Dorm Dump' },
      { property: 'og:description', content: 'One account for saving finds, messaging sellers, and listing your own things.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Auth,
});

function Auth() {
  const { signedIn, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && signedIn) void navigate({ to: '/', replace: true });
  }, [ready, signedIn, navigate]);

  return (
    <main className="page-container min-h-[70vh] screen-enter flex items-center justify-center py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <Button variant="ghost" size="sm" asChild className="-ml-3 mb-6 px-3">
          <Link to="/">
            <ArrowLeft />
            Back to the marketplace
          </Link>
        </Button>
        <span className="eyebrow">
          <Sparkles size={13} />
          Students only
        </span>
        <h1 className="mt-3 text-3xl font-bold leading-tight">Sign in to keep things moving</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Browsing stays open to everyone. An account is what lets you save finds, message a seller, reserve an item, and post your own listings.
        </p>
        <div className="mt-7">
          <GoogleButton />
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" />
          Your Google account name and photo become your campus profile. Nothing is shared with other students beyond what you post.
        </p>
        <div className="mt-7 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
          <Leaf size={14} className="text-primary" />
          Less waste. More possibility.
        </div>
      </div>
    </main>
  );
}

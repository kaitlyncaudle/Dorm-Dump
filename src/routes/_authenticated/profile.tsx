import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Check, LogOut, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { initialsOf, useAuth, useSignOut } from '@/lib/auth';

export const Route = createFileRoute('/_authenticated/profile')({
  head: () => ({
    meta: [
      { title: 'Your profile · Dorm Dump' },
      { name: 'description', content: 'Check the name and photo fellow Bulldogs see on your listings and messages.' },
      { property: 'og:title', content: 'Your profile · Dorm Dump' },
      { property: 'og:description', content: 'The campus face your listings show.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { profile, userId, refresh } = useAuth();
  const signOut = useSignOut();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.display_name ?? '');
  }, [profile?.display_name]);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed || !userId) {
      toast.error('Add a name to show on your listings.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ display_name: trimmed }).eq('id', userId);
    setSaving(false);
    if (error) {
      toast.error('Your name could not be saved. Please try again.');
      return;
    }
    refresh();
    toast.success('Your campus name is updated.');
  };

  return (
    <main className="page-container min-h-[65vh] screen-enter">
      <Button variant="ghost" asChild className="mb-4 mt-3 pl-0">
        <Link to="/">
          <ArrowLeft />
          Back to the marketplace
        </Link>
      </Button>
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold">Your campus profile</h1>
        <p className="mb-7 mt-2 text-sm text-muted-foreground">This is what buyers see next to your listings.</p>

        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <span className="avatar h-14 w-14 text-lg">{initialsOf(name || profile?.display_name || '')}</span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profile?.display_name || 'Your name'}</p>
            <p className="mt-1 text-xs text-muted-foreground">Photo comes from your Google account.</p>
          </div>
        </div>

        <label className="form-field mt-6">
          Name shown on your listings
          <input className="field-input" maxLength={40} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Donavan Slack" />
        </label>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button variant="ghost" className="pl-0" onClick={() => void signOut()}>
            <LogOut />
            Sign out
          </Button>
          <Button onClick={() => void save()} disabled={saving || !name.trim()}>
            <Check />
            {saving ? 'Saving…' : 'Save name'}
          </Button>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <UserRound size={13} />
          Only your name and photo are shown. Your email stays private.
        </p>
      </div>
    </main>
  );
}

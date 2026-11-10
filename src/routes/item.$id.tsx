import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, CalendarDays, Check, Heart, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/lib/marketplace';
import { useAuth } from '@/lib/auth';
import { useRequireAccount } from '@/lib/use-require-account';
import { GoogleButton } from '@/components/google-button';

export const Route = createFileRoute('/item/$id')({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Dorm Dump` }, { name: 'description', content: 'Details, pickup spot, and seller for this campus find on Dorm Dump.' }, { property: 'og:title', content: `${params.id} · Dorm Dump` }, { property: 'og:description', content: 'A pre-loved dorm essential from a fellow Bulldog.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: ItemDetail,
});

function ItemDetail() {
  const { id } = Route.useParams();
  const { items, saved, toggleSave, reserved, reserve, setChatItem } = useMarketplace();
  const { signedIn } = useAuth();
  const requireAccount = useRequireAccount();
  const navigate = useNavigate();
  const item = items.find(i => i.id === id) ?? items[0];
  if (!item) {
    return <main className="page-container min-h-[60vh] screen-enter"><div className="empty-state"><MapPin className="mx-auto mb-3 text-primary" size={32} /><h2 className="text-xl font-semibold">That find is gone</h2><p className="mt-2 text-sm text-muted-foreground">It may have found a new home already.</p><Button asChild className="mt-5"><Link to="/">Back to the marketplace</Link></Button></div></main>;
  }
  const isSaved = saved.includes(item.id);
  const isReserved = reserved.includes(item.id);

  const onSave = () => {
    if (!requireAccount('Sign in to save finds', 'Your saved list lives in your student account.')) return;
    toggleSave(item.id);
  };
  const onReserve = () => {
    if (!requireAccount('Sign in to reserve items', 'A hold is tied to your student account.', `/item/${item.id}`)) return;
    reserve(item.id);
  };
  const onMessage = () => {
    if (!requireAccount('Sign in to message sellers', 'Conversations live in your student account.', '/messages')) return;
    setChatItem(item);
    navigate({ to: '/messages' });
  };

  return <main className="page-container screen-enter">
    <div className="flex items-center justify-between py-2"><Button variant="ghost" asChild className="pl-0"><Link to="/"><ArrowLeft />Back to marketplace</Link></Button><Button variant="ghost" size="icon" onClick={onSave} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${item.title}`} className={isSaved ? 'text-primary' : ''}><Heart size={18} fill={isSaved ? 'currentColor' : 'none'} /></Button></div>
    <div className="detail-grid">
      <div className="detail-photo"><img src={item.image} alt={item.title} width={1024} height={1024} /><span className="item-badge">{item.condition}</span></div>
      <div>
        <div className="text-xs font-semibold text-primary">{item.category.toUpperCase()}</div>
        <h1 className="mt-2 text-3xl font-bold leading-tight">{item.title}</h1>
        <div className="mt-3 text-3xl font-bold text-primary">{item.price === 0 ? 'Free' : `$${item.price}`}</div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><MapPin size={14} />{item.location}</span><span className="flex items-center gap-1.5"><CalendarDays size={14} />Listed {item.time}</span></div>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">{item.description}</p>
        <div className="mt-6 rounded-md border border-border bg-muted/40 p-4"><div className="flex items-center gap-3"><span className="avatar">{item.initials}</span><div><div className="text-sm font-semibold">{item.seller}</div><div className="text-xs text-muted-foreground">AAMU student · Verified with school email</div></div><ShieldCheck size={18} className="ml-auto text-primary" /></div></div>
        {signedIn ? <div className="mt-6 grid grid-cols-2 gap-3">
          <Button className="h-11" onClick={onReserve} disabled={isReserved}><Check />{isReserved ? 'Reserved for you' : 'Reserve for pickup'}</Button>
          <Button variant="outline" className="h-11" onClick={onMessage}><MessageCircle />Message seller</Button>
        </div> : <div className="mt-6 rounded-md border border-border bg-card p-5">
          <p className="text-sm font-semibold">Sign in to reserve or message</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Browsing stays open to everyone. An account is what lets you hold this item and talk to the seller about pickup.</p>
          <div className="mt-4"><GoogleButton /></div>
        </div>}
        <p className="mt-4 text-xs text-muted-foreground">Demo prototype · No payment is collected and nothing is charged.</p>
      </div>
    </div>
  </main>;
}

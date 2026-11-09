import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { ArrowUpRight, Heart, Leaf, LogOut, MapPin, MessageCircle, Plus, ShieldCheck, ShoppingBag, Recycle, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMarketplace } from '@/lib/marketplace';
import { initialsOf, useAuth, useSignOut } from '@/lib/auth';

function AccountMenu() {
  const { ready, signedIn, profile } = useAuth();
  const signOut = useSignOut();

  if (!ready) return <span className="avatar" aria-hidden="true">··</span>;

  if (!signedIn) {
    return (
      <Button variant="outline" asChild>
        <Link to="/auth">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="account-trigger" aria-label="Your account">
          {profile?.avatar_url ? <img src={profile.avatar_url} alt="" width={35} height={35} className="account-avatar" /> : <span className="avatar">{initialsOf(profile?.display_name ?? '')}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate text-sm font-semibold">{profile?.display_name || 'Your profile'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">
            <UserRound />
            Your profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/my-listings">
            <ShoppingBag />
            My listings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/saved">
            <Heart />
            Saved finds
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MarketplaceHeader() {
  const path = useRouterState({ select: s => s.location.pathname });
  const { saved } = useMarketplace();
  return <><header className="site-header"><div className="page-container header-inner">
    <Link to="/" className="brand" aria-label="Dorm Dump home"><span className="brand-mark"><Recycle size={24} /></span>Dorm dump<span className="text-primary">.</span></Link>
    <nav className="main-nav" aria-label="Main navigation">
      <Link to="/" className={`nav-item ${path === '/' || path.startsWith('/item/') ? 'active' : ''}`}><ShoppingBag size={16} />Marketplace</Link>
      <Link to="/my-listings" className={`nav-item ${path === '/my-listings' ? 'active' : ''}`}>My listings</Link>
      <Link to="/messages" className={`nav-item ${path === '/messages' ? 'active' : ''}`}><MessageCircle size={16} />Messages</Link>
      <Link to="/saved" className={`nav-item ${path === '/saved' ? 'active' : ''}`}><Heart size={16} />Saved{saved.length > 0 && <span className="text-primary">{saved.length}</span>}</Link>
    </nav>
    <div className="header-actions flex items-center gap-4"><Button asChild><Link to="/sell"><Plus />Sell an item</Link></Button><AccountMenu /></div>
  </div></header><div className="page-container campus-bar"><span className="flex items-center gap-2"><MapPin size={13} /><strong className="font-medium text-foreground">Alabama A&amp;M University</strong><span className="mx-1">/</span>Brought to you by StudentX&nbsp;</span><span className="flex items-center gap-2"><ShieldCheck size={13} />Student community<span className="ml-3 rounded bg-secondary px-2 py-0.5 text-primary">Demo</span></span></div></>;
}
export function MarketplaceFooter() { return <footer className="footer"><div className="page-container flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2"><Leaf size={14} />Less waste. More possibility.</span><span>Dorm Dump · Alabama A&amp;M student prototype</span><span className="flex items-center gap-1">Made for the next chapter <ArrowUpRight size={13} /></span></div></footer>; }

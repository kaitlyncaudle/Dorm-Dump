import { Link } from '@tanstack/react-router';
import { Heart, MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace, type Item } from '@/lib/marketplace';
import { useRequireAccount } from '@/lib/use-require-account';

export function ItemCard({ item }: { item: Item }) {
  const { saved, toggleSave, reserved } = useMarketplace();
  const requireAccount = useRequireAccount();
  const isSaved = saved.includes(item.id);
  const onSave = () => {
    if (!requireAccount('Sign in to save finds', 'Your saved list lives in your student account.')) return;
    toggleSave(item.id);
  };
  return <article className="product-card"><div className="product-photo"><Link to="/item/$id" params={{ id: item.id }} aria-label={`View ${item.title}`}><img src={item.image} alt={item.title} width={1024} height={1024} loading="lazy" /></Link><Button variant="ghost" size="icon" className={`save-button ${isSaved ? 'is-saved' : ''}`} onClick={onSave} aria-label={`${isSaved ? 'Unsave' : 'Save'} ${item.title}`} title={isSaved ? 'Remove from saved' : 'Save item'}><Heart size={16} fill={isSaved ? 'currentColor' : 'none'} /></Button><span className={`item-badge ${item.price === 0 ? 'free' : ''}`}>{reserved.includes(item.id) ? 'Reserved by you' : item.price === 0 ? 'Free to a good dorm' : item.condition}</span></div><div className="product-info"><div className="product-price text-primary">{item.price === 0 ? 'Free' : `$${item.price}`}<span className="ml-1 text-xs font-normal text-muted-foreground">{item.price > 0 && 'USD'}</span></div><Link to="/item/$id" params={{ id: item.id }}><h3 className="product-title">{item.title}</h3></Link><div className="product-meta"><span className="flex items-center gap-1"><MapPin size={11} />{item.location}</span><span>{item.time}</span></div><div className="product-seller"><span className="avatar">{item.initials}</span><span>{item.seller}</span><ShieldCheck size={12} className="text-primary" /><span className="ml-auto text-muted-foreground">AAMU student</span></div></div></article>;
}

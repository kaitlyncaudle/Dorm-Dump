import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Armchair, BookOpen, ChevronDown, Grid2X2, Lamp, Leaf, MapPin, Refrigerator, Search, ShieldCheck, SlidersHorizontal, Sparkles, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/item-card';
import { categories, useMarketplace } from '@/lib/marketplace';
import dormImage from '@/assets/mini-fridge.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [{ title: 'Dorm Dump · Find your next dorm essential' }, { name: 'description', content: 'Browse affordable furniture, textbooks, and dorm essentials in the Alabama A&M student marketplace.' }, { property: 'og:title', content: 'Dorm Dump · Your campus marketplace' }, { property: 'og:description', content: 'Find a new home for your dorm essentials. Buy, sell, and share with your campus community.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  component: Index,
});
const icons = [Grid2X2, Armchair, Refrigerator, BookOpen, Lamp, BedDouble];
function Index() {
  const { items } = useMarketplace();
  const [category, setCategory] = useState('All items');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [filters, setFilters] = useState(false);
  const [condition, setCondition] = useState('Any condition');
  const [free, setFree] = useState(false);
  const visible = items.filter(i => (category === 'All items' || i.category === category) && `${i.title} ${i.description} ${i.category}`.toLowerCase().includes(search.toLowerCase()) && (condition === 'Any condition' || i.condition === condition) && (!free || i.price === 0)).sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : 0);
  return <main className="page-container screen-enter"><section className="market-banner"><div className="banner-copy"><span className="eyebrow"><Leaf size={13} />Good finds. Smaller footprint.</span><h1>New semester.<br /><span>Secondhand possibilities.</span></h1><p>Your next dorm essential is already on campus.<br />Buy, sell, and give good things a second home.</p><div className="banner-stats"><span><ShieldCheck size={14} />Students only</span><span><MapPin size={14} />Campus pickup</span><span><RecycleIcon />Less waste</span></div></div><img className="banner-image" src={dormImage} alt="Cream mini fridge in a sunlit student dorm room" width={1024} height={1024} /></section>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">Find your next good thing</h2><p className="mt-1 text-xs text-muted-foreground">A little pre-loved. A lot of potential.</p></div><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Sparkles size={14} className="text-primary" />Fresh finds from fellow Bulldogs</span></div>
    <div className="mt-5 flex gap-3"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-input bg-card px-4"><Search size={18} className="shrink-0 text-muted-foreground" /><input aria-label="Search marketplace" placeholder="Search for a mini fridge, desk, textbooks..." value={search} onChange={e => setSearch(e.target.value)} className="h-12 w-full min-w-0 bg-transparent text-sm outline-none" /></label><Button variant="outline" className="h-12 px-4" onClick={() => setFilters(!filters)} aria-expanded={filters}><SlidersHorizontal />Filters</Button></div>
    {filters && <div className="mt-3 flex flex-wrap items-center gap-4 rounded-md border border-border bg-card p-4"><label className="flex items-center gap-2 text-xs">Condition<select aria-label="Item condition" className="field-input" value={condition} onChange={e => setCondition(e.target.value)}>{['Any condition','New','Gently Used','Well Loved'].map(c => <option key={c}>{c}</option>)}</select></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={free} onChange={e => setFree(e.target.checked)} className="accent-primary" />Free items only</label><Button variant="ghost" size="sm" onClick={() => { setCondition('Any condition'); setFree(false); }}>Reset filters</Button></div>}
    <div className="mt-4 flex flex-wrap gap-2">{categories.map((c,index) => { const Icon = icons[index]; return <Button key={c} variant="ghost" className={`filter-chip ${category === c ? 'selected' : ''}`} onClick={() => setCategory(c)}>{Icon && <Icon size={15} />}{c}</Button>; })}</div>
    <div className="mb-4 mt-7 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-semibold">Just listed<span className="rounded bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">{visible.length} items</span></div><label className="flex items-center gap-1 text-xs text-muted-foreground">Sort:<select aria-label="Sort items" value={sort} onChange={e => setSort(e.target.value)} className="max-w-36 cursor-pointer appearance-none bg-transparent pl-1 font-medium text-foreground outline-none"><option value="recent">Newest first</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><ChevronDown size={12} /></label></div>
    {visible.length ? <div className="product-grid">{visible.map(item => <ItemCard key={item.id} item={item} />)}</div> : <div className="empty-state"><Search className="mx-auto mb-3 text-muted-foreground" /><h3 className="font-semibold">No finds just yet</h3><p className="mt-2 text-sm text-muted-foreground">Try a different search or category.</p><Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setCategory('All items'); setCondition('Any condition'); setFree(false); }}>Clear search & filters</Button></div>}
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><span className="flex items-center gap-2 text-xs text-muted-foreground"><Leaf size={15} className="text-primary" />One student’s move-out. Another student’s fresh start.</span><span className="text-xs text-muted-foreground">A more circular campus starts with us.</span></div>
  </main>;
}
function RecycleIcon() { return <Leaf size={14} />; }

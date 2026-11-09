import { createContext, useContext, useState, type ReactNode } from 'react';
import fridge from '@/assets/mini-fridge.jpg';
import desk from '@/assets/desk.jpg';
import books from '@/assets/books.jpg';
import lamp from '@/assets/lamp.jpg';

export type Item = { id: string; title: string; price: number; category: string; condition: string; image: string; seller: string; initials: string; location: string; time: string; description: string; mine?: boolean };
export const categories = ['All items', 'Furniture', 'Appliances', 'Textbooks', 'Decor', 'Bedding'];
export const initialItems: Item[] = [
  { id: 'mini-fridge', title: 'Retro mini fridge · cream', price: 65, category: 'Appliances', condition: 'Gently Used', image: fridge, seller: 'Rachel H.', initials: 'RH', location: 'Foster Hall', time: '2 hours ago', description: 'The perfect size for a dorm room! This cream mini fridge keeps drinks and snacks cold without taking up much space. Clean, works great, and ready for a new home. Selling because I’m moving off campus.' },
  { id: 'study-desk', title: 'Oak study desk + chair', price: 40, category: 'Furniture', condition: 'Gently Used', image: desk, seller: 'Donavan S.', initials: 'DS', location: 'Normal Hills', time: '3 hours ago', description: 'Light oak desk and matching white chair. A comfortable setup for study sessions, with plenty of room for your laptop and notes. Both are included. Pickup on campus.' },
  { id: 'textbooks', title: 'Freshman textbook bundle', price: 25, category: 'Textbooks', condition: 'Well Loved', image: books, seller: 'Jordan M.', initials: 'JM', location: 'Campus Library', time: '4 hours ago', description: 'Four introductory course textbooks looking for their next reader. Some highlighting and notes inside. Message me to check titles and editions before reserving.' },
  { id: 'desk-lamp', title: 'Sage green desk lamp', price: 0, category: 'Decor', condition: 'Gently Used', image: lamp, seller: 'Alex T.', initials: 'AT', location: 'Student Center', time: '5 hours ago', description: 'A little extra light for your study corner. Adjustable sage green desk lamp, working bulb included. Free to another Bulldog who can put it to good use!' },
];
type MarketState = { items: Item[]; saved: string[]; reserved: string[]; toggleSave: (id: string) => void; reserve: (id: string) => void; addItem: (item: Item) => void; chatItem: Item | undefined; setChatItem: (item: Item) => void; messages: string[]; sendMessage: (text: string) => void };
const MarketContext = createContext<MarketState | undefined>(undefined);
export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(initialItems);
  const [saved, setSaved] = useState<string[]>([]);
  const [reserved, setReserved] = useState<string[]>([]);
  const [chatItem, setChatItem] = useState<Item>();
  const [messages, setMessages] = useState<string[]>([]);
  return <MarketContext.Provider value={{ items, saved, reserved, toggleSave: id => setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]), reserve: id => setReserved(old => old.includes(id) ? old : [...old, id]), addItem: item => setItems(old => [item, ...old]), chatItem, setChatItem, messages, sendMessage: text => setMessages(old => [...old, text]) }}>{children}</MarketContext.Provider>;
}
export function useMarketplace() { const value = useContext(MarketContext); if (!value) throw new Error('MarketplaceProvider is required'); return value; }
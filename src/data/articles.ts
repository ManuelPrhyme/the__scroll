export interface Article {
  id: string;
  title: string;
  snippet: string;
  author: string;
  authorAvatar: string;
  date: string;
  tags: string[];
  price: number;
  fullContent: string;
  subscriberCount: number;
  authorAddress?: `0x${string}`;
}

export const MOCK_ARTICLES: Article[] = [
  {
    id: '4',
    title: 'The Future of Decentralized Narrative',
    snippet: 'In the evolving landscape of web3, the written word remains the most potent vehicle for truth. As we move away from centralized silos, the concept of the "Scroll" emerges as a permanent ledger of thought that cannot be censored or silenced.',
    author: 'Elena Voss',
    authorAvatar: 'EV',
    date: 'Mar 12, 2026',
    tags: ['Web3', 'Culture'],
    price: 1,
    fullContent: 'In the evolving landscape of web3, the written word remains the most potent vehicle for truth. As we move away from centralized silos, the concept of the "Scroll" emerges as a permanent ledger of thought that cannot be censored or silenced.\n\nThe printing press democratized knowledge. The internet democratized distribution. Now, blockchain democratizes ownership. Every article published on The Scroll is a signed transaction — an immutable record that this idea existed, at this moment, by this mind.\n\nWe are not building another blogging platform. We are building the Library of Alexandria, but one that cannot burn.',
    subscriberCount: 12,
    authorAddress: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
  },
  {
    id: '5',
    title: 'SOmnia Tokenomics: A Deep Dive into Value Creation',
    snippet: 'Understanding the economic model behind SOmnia tokens reveals a carefully designed incentive structure that rewards both readers and writers. The circular economy of attention and compensation creates a sustainable ecosystem.',
    author: 'Marcus Chen',
    authorAvatar: 'MC',
    date: 'Mar 10, 2026',
    tags: ['Tokenomics', 'DeFi'],
    price: 8,
    fullContent: 'Understanding the economic model behind SOmnia tokens reveals a carefully designed incentive structure that rewards both readers and writers.\n\nThe circular economy of attention and compensation creates a sustainable ecosystem where quality rises to the top — not through algorithmic manipulation, but through genuine reader investment.\n\nWhen you spend 5 SOmnia to read an article, 80% goes directly to the author. 15% is distributed to previous readers who highlighted key passages. 5% sustains the protocol.\n\nThis is not a tipping model. This is a market for ideas.',
    subscriberCount: 3,
    authorAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  },
  {
    id: '6',
    title: 'Why I Left Medium for The Scroll',
    snippet: 'After seven years and 200,000 followers on Medium, I made the decision to move my entire archive on-chain. Here is what I learned about ownership, censorship, and the true cost of "free" platforms.',
    author: 'Sarah Okafor',
    authorAvatar: 'SO',
    date: 'Mar 8, 2026',
    tags: ['Opinion', 'Web3'],
    price: 3,
    fullContent: 'After seven years and 200,000 followers on Medium, I made the decision to move my entire archive on-chain.\n\nThe trigger was simple: an article about financial sovereignty was flagged and removed without explanation. Seven years of trust, gone in a single moderation decision I had no right to appeal.\n\nOn The Scroll, my words are mine. Not because of a terms-of-service promise, but because of mathematics. Cryptographic signatures do not have a "content policy" team.\n\nThe cost? I pay gas fees instead of giving away 50% of my subscription revenue. The readers pay per article instead of a flat monthly fee that subsidizes content they never read.',
    subscriberCount:16,
    authorAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  },
];

export const MY_PUBLISHED: Article[] = [MOCK_ARTICLES[0], MOCK_ARTICLES[3]];
export const MY_SUBSCRIBED: Article[] = [MOCK_ARTICLES[1], MOCK_ARTICLES[2], MOCK_ARTICLES[4]];

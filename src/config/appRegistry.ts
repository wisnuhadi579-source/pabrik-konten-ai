import { Car, Sparkles } from 'lucide-react';
import { Tool } from '../types/app';

export const appRegistry: Tool[] = [
  {
    id: 'car-restoration',
    name: 'Cinematic Car Restoration Pro',
    description: 'Generate cinematic restoration prompts for high-end automotive content.',
    icon: Car,
    isComingSoon: false,
    images: ['https://picsum.photos/seed/car1/800/450', 'https://picsum.photos/seed/car2/800/450'],
    features: ['Cinematic Prompts', 'Detailing Focus', 'Lighting Optimization'],
    labels: ['Creator', 'Automotive'],
    plan: 'Premium',
    buyLink: '#',
    tutorialLink: '#'
  },
  {
    id: 'ai-writer',
    name: 'AI Content Writer',
    description: 'Create high-converting copy for social media and blogs using advanced AI.',
    icon: Sparkles,
    isComingSoon: true,
    images: ['https://picsum.photos/seed/write1/800/450'],
    features: ['SEO Optimized', 'Tone Control', 'Multi-language'],
    labels: ['Marketing', 'Blogger'],
    plan: 'Gratis',
    buyLink: '#',
    tutorialLink: '#'
  }
];

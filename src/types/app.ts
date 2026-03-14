import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isComingSoon: boolean;
  url: string;
  images: string[];
  features: string[];
  labels: string[];
  plan: 'Gratis' | 'Premium' | 'Free' | 'VIP';
  buyLink: string;
  tutorialLink: string;
}

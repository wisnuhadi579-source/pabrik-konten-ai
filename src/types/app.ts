import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isComingSoon: boolean;
  images: string[];
  features: string[];
  labels: string[];
  plan: 'Gratis' | 'Premium';
  buyLink: string;
  tutorialLink: string;
}

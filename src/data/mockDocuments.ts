import { DocumentItem } from '../types';

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const SAMPLE_DOCUMENTS = INITIAL_DOCUMENTS;

export const DEFAULT_USER_SETTINGS = {
  name: 'User',
  email: 'user@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  aiModel: 'gemini-2.5-flash',
  defaultSummaryLength: 'medium' as const,
  ocrPrecision: 'high' as const,
  autoIndexOnUpload: true,
  twoFactorAuth: false,
};

export const INITIAL_NOTIFICATIONS = [];

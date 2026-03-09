import { IS_MOCK } from '@/lib/constants/env';
import { MockNotionAdapter } from './notion/mock';
import { MockShareFileAdapter } from './sharefile/mock';
import { MockGmailAdapter } from './gmail/mock';
import type { NotionAdapter } from './notion/types';
import type { ShareFileAdapter } from './sharefile/types';
import type { GmailAdapter } from './gmail/types';

// Re-export types
export type { NotionAdapter } from './notion/types';
export type { ShareFileAdapter } from './sharefile/types';
export type { GmailAdapter } from './gmail/types';
export type { NotionTripRecord, NotionTravellerRecord } from './notion/types';
export type { ShareFileDocument, PreferenceFormData } from './sharefile/types';
export type { GmailDraft } from './gmail/types';

// Factory functions — swap to live adapters when ready
function createNotionAdapter(): NotionAdapter {
  if (IS_MOCK) return new MockNotionAdapter();
  // TODO: return new LiveNotionAdapter() when ready
  return new MockNotionAdapter();
}

function createShareFileAdapter(): ShareFileAdapter {
  if (IS_MOCK) return new MockShareFileAdapter();
  // TODO: return new LiveShareFileAdapter() when ready
  return new MockShareFileAdapter();
}

function createGmailAdapter(): GmailAdapter {
  if (IS_MOCK) return new MockGmailAdapter();
  // TODO: return new LiveGmailAdapter() when ready
  return new MockGmailAdapter();
}

// Singleton instances
export const notion: NotionAdapter = createNotionAdapter();
export const sharefile: ShareFileAdapter = createShareFileAdapter();
export const gmail: GmailAdapter = createGmailAdapter();

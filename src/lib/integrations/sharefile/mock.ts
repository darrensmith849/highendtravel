import { getDemoStore } from '@/lib/demo-data';
import type { ShareFileAdapter, ShareFileDocument, PreferenceFormData } from './types';

export class MockShareFileAdapter implements ShareFileAdapter {
  async getLinkedDocuments(tenantId: string, tripId: string): Promise<ShareFileDocument[]> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return [];

    return store.documents
      .filter((d) => d.trip_id === tripId)
      .map((d) => ({
        id: d.id,
        fileName: d.file_name,
        fileType: d.file_type,
        sharefileId: d.sharefile_id,
        status: d.status,
        category: d.category,
        uploadedAt: d.created_at,
      }));
  }

  async getDocumentMetadata(tenantId: string, documentId: string): Promise<ShareFileDocument | null> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return null;

    const doc = store.documents.find((d) => d.id === documentId);
    if (!doc) return null;

    return {
      id: doc.id,
      fileName: doc.file_name,
      fileType: doc.file_type,
      sharefileId: doc.sharefile_id,
      status: doc.status,
      category: doc.category,
      uploadedAt: doc.created_at,
    };
  }

  async getPreferenceFormExtraction(tenantId: string, tripId: string): Promise<PreferenceFormData> {
    const store = getDemoStore();
    if (store.tenant.id !== tenantId) return { extracted: false, formStatus: 'missing', data: null };

    const prefDoc = store.documents.find(
      (d) => d.trip_id === tripId && d.category === 'preference_form'
    );

    if (!prefDoc || prefDoc.status === 'missing') {
      return { extracted: false, formStatus: 'missing', data: null };
    }

    const prefs = store.preferences.filter((p) => p.trip_id === tripId);
    const data: Record<string, string> = {};
    prefs.forEach((p) => {
      data[p.preference_key] = p.preference_value;
    });

    return {
      extracted: true,
      formStatus: 'completed',
      data,
    };
  }
}

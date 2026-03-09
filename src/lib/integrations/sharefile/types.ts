export interface ShareFileDocument {
  id: string;
  fileName: string;
  fileType: string;
  sharefileId: string | null;
  status: 'completed' | 'missing' | 'pending';
  category: string;
  uploadedAt: string;
}

export interface PreferenceFormData {
  extracted: boolean;
  formStatus: 'completed' | 'missing';
  data: Record<string, string> | null;
}

export interface ShareFileAdapter {
  getLinkedDocuments(tenantId: string, tripId: string): Promise<ShareFileDocument[]>;
  getDocumentMetadata(tenantId: string, documentId: string): Promise<ShareFileDocument | null>;
  getPreferenceFormExtraction(tenantId: string, tripId: string): Promise<PreferenceFormData>;
}

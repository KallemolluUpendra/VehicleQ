import { registerPlugin } from '@capacitor/core';

export interface SaveFilePlugin {
  createDocument(options: { fileName: string; mimeType: string }): Promise<{ uri: string }>;
  writeToUri(options: { uri: string; data: string }): Promise<void>;
}

export const SaveFile = registerPlugin<SaveFilePlugin>('SaveFile');

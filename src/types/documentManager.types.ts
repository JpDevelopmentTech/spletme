export interface Document {
  _id?: string;
  id?: string;
  songId: string;
  uploadedBy: string;
  name: string;
  type: string;
  size: string;
  uploadDate: Date | string;
  url: string;
  firebasePath: string;
}

export interface DocumentResponse {
  success: boolean;
  data?: Document[] | Document | null;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    skip: number;
    limit: number;
  };
}

export interface DownloadResponse {
  success: boolean;
  url?: string;
  name?: string;
  type?: string;
  message?: string;
  error?: string;
}

export interface DeleteResponse {
  success: boolean;
  deleted?: boolean;
  message?: string;
  error?: string;
}

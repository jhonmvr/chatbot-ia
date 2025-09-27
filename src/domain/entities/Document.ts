export interface DocumentEntity {
  id: string;
  sourceUri: string;
  title?: string;
  lang?: string;
  collection?: string;
  embeddingModel: string;
  version: number;
}

import { fetcherFile } from '@lib/fetcher/api.fetcher';
import download from 'downloadjs';

export const fetchAndDownload = async (fileKey: string) => {
  const result = await fetcherFile(fileKey);
  download(result.blob, result.fileName, result.contentType);
};

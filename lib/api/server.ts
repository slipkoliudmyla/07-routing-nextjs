import 'server-only';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

function getNoteHubClient() {
  const token =
    process.env.NOTEHUB_TOKEN ?? process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (!token) throw new Error('NoteHub API credentials are missing.');

  return axios.create({
    baseURL:
      process.env.NOTEHUB_API_URL ?? 'https://notehub-public.goit.study/api',
    headers: { Authorization: 'Bearer ' + token },
    timeout: 10_000,
  });
}

export class NoteHubError extends Error {
  constructor(readonly status?: number) {
    super('The NoteHub API could not complete the request.');
  }
}

export async function requestNoteHub<Data>(
  request: (client: AxiosInstance) => Promise<AxiosResponse<Data>>,
): Promise<Data> {
  try {
    const { data } = await request(getNoteHubClient());
    return data;
  } catch (error) {
    throw new NoteHubError(
      axios.isAxiosError(error) ? error.response?.status : undefined,
    );
  }
}

import 'server-only';
import axios from 'axios';

export function getNoteHubClient() {
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

export function noteHubErrorResponse(error: unknown) {
  const upstreamStatus = axios.isAxiosError(error) && error.response?.status;
  const status =
    upstreamStatus && upstreamStatus >= 400 && upstreamStatus < 500
      ? upstreamStatus
      : 502;

  return Response.json({ message: 'NoteHub API request failed.' }, { status });
}

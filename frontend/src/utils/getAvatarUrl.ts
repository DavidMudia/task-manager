const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const SERVER_URL =
  API_URL.replace(/\/api\/?$/, '');

export function getAvatarUrl(
  avatarUrl?: string | null
) {
  if (!avatarUrl) {
    return null;
  }

  if (
    avatarUrl.startsWith('http://') ||
    avatarUrl.startsWith('https://')
  ) {
    return avatarUrl;
  }

  return `${SERVER_URL}${avatarUrl}`;
}
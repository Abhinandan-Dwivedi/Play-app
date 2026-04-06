export function proxyCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;

  if (url.startsWith('/api/v1/media')) return url;

  try {
    const parsed = new URL(url, window.location.origin);
    if (!parsed.hostname.includes('res.cloudinary.com')) return url;

    const proxied = `/api/v1/media/cloudinary${parsed.pathname}${parsed.search}`;
    return proxied;
  } catch (e) {
    return url;
  }
}

export default proxyCloudinaryUrl;
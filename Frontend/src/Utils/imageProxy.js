export function proxyCloudinaryUrl(url) {
   if (!url || typeof url !== 'string') return "";

   if (url.startsWith('/')) return url;

  try { 
    let securedUrl = url.replace("http://", "https://");

    return securedUrl;
  } catch (e) {
    console.error("URL transformation error:", e);
    return url;
  }
}

export default proxyCloudinaryUrl;
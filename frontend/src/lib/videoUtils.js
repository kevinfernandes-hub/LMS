/**
 * Video URL utilities for parsing YouTube and Google Drive links
 * Extracts video IDs, generates embed URLs, and validates formats
 */

/**
 * Extracts video ID and generates embed URL from YouTube or Google Drive link
 * @param {string} url - Raw video URL
 * @returns {object|null} { platform, id, embedUrl, thumbnailUrl } or null if invalid
 */
export const extractVideoId = (url) => {
  if (!url) return null;

  // YouTube patterns
  const youtubePatterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?\n]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?\n]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?\n]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      return {
        platform: 'youtube',
        id: videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&color=white&iv_load_policy=3&showinfo=0`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      };
    }
  }

  // Google Drive patterns
  const drivePatterns = [
    /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/,
    /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/open\?id=([a-zA-Z0-9-_]+)/,
  ];

  for (const pattern of drivePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        platform: 'gdrive',
        id: fileId,
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        thumbnailUrl: null,
      };
    }
  }

  return null;
};

/**
 * Validates if URL is a supported video link
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidVideoUrl = (url) => {
  return extractVideoId(url) !== null;
};

/**
 * Gets platform label from URL
 * @param {string} url - Video URL
 * @returns {string} 'YouTube' or 'Google Drive'
 */
export const getPlatformLabel = (url) => {
  const result = extractVideoId(url);
  if (!result) return '';
  return result.platform === 'youtube' ? 'YouTube' : 'Google Drive';
};

/**
 * Gets platform key from URL
 * @param {string} url - Video URL
 * @returns {string} 'youtube' or 'gdrive'
 */
export const getPlatform = (url) => {
  const result = extractVideoId(url);
  return result?.platform || '';
};

/**
 * Normalizes video URL (removes extra params, etc)
 * @param {string} url - Raw URL
 * @returns {string} Cleaned URL
 */
export const normalizeUrl = (url) => {
  if (!url) return '';
  return url.trim().split('&list=')[0]; // Remove playlist params
};

/**
 * Utility functions for processing images in editor content
 */

/**
 * Extracts base64 images from HTML content and uploads them
 * @param htmlContent - HTML content that may contain base64 images
 * @param uploadCallback - Function to upload image file and return URL
 * @returns HTML content with base64 images replaced by server URLs
 */
export async function processImagesInContent(
  htmlContent: string,
  uploadCallback: (file: File) => Promise<string>
): Promise<string> {
  // Find all base64 image data URLs
  const base64Regex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"[^>]*>/g;
  const matches = Array.from(htmlContent.matchAll(base64Regex));
  
  if (matches.length === 0) {
    return htmlContent; // No base64 images found
  }

  let processedContent = htmlContent;

  // Process each base64 image
  for (const match of matches) {
    const fullMatch = match[0];
    const base64Data = match[1];
    
    try {
      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Determine file extension from MIME type
      const mimeType = blob.type;
      const extension = mimeType.split('/')[1] || 'png';
      
      // Create a File object from blob
      const file = new File([blob], `image-${Date.now()}.${extension}`, { type: blob.type });
      
      // Upload the image
      const imageUrl = await uploadCallback(file);
      
      // Replace base64 data URL with server URL
      processedContent = processedContent.replace(
        base64Data,
        imageUrl
      );
    } catch (error) {
      console.error('Failed to process image:', error);
      // Keep the base64 image if upload fails
    }
  }

  return processedContent;
}

/**
 * Extracts all image URLs from HTML content
 * @param htmlContent - HTML content
 * @returns Array of image URLs (both base64 and regular URLs)
 */
export function extractImageUrls(htmlContent: string): string[] {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const matches = Array.from(htmlContent.matchAll(imgRegex));
  return matches.map(match => match[1]);
}

/**
 * Checks if content contains base64 images
 * @param htmlContent - HTML content
 * @returns true if content contains base64 images
 */
export function hasBase64Images(htmlContent: string): boolean {
  const base64Regex = /data:image\/[^;]+;base64,/;
  return base64Regex.test(htmlContent);
}


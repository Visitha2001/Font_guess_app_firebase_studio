'use server';

import { identifyFontFromImage, IdentifyFontFromImageOutput } from '@/ai/flows/identify-font-from-image';
import { z } from 'zod';

const actionSchema = z.object({
  imageDataUri: z.string().optional(),
  imageUrl: z.string().url({ message: "Invalid URL provided." }).optional(),
}).refine(data => data.imageDataUri || data.imageUrl, {
  message: "Either an image file or a URL must be provided.",
});

async function get_image_data_uri(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('URL does not point to a valid image.');
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    throw new Error("Could not process the image from the provided URL. Please check the URL or try uploading the image directly.");
  }
}

export async function identifyFontAction(
  values: z.infer<typeof actionSchema>
): Promise<{ suggestions: IdentifyFontFromImageOutput['suggestions'] } | { error: string }> {
  const validation = actionSchema.safeParse(values);
  if (!validation.success) {
    return { error: validation.error.errors.map(e => e.message).join(', ') };
  }
  
  const { imageDataUri, imageUrl } = validation.data;

  try {
    let finalImageDataUri = imageDataUri;
    
    if (imageUrl && !finalImageDataUri) {
        finalImageDataUri = await get_image_data_uri(imageUrl);
    }
    
    if (!finalImageDataUri) {
        return { error: 'No image data provided.' };
    }

    const result = await identifyFontFromImage({ photoDataUri: finalImageDataUri });
    if (!result.suggestions || result.suggestions.length === 0) {
      return { error: 'Could not identify any fonts. Try a different image.' };
    }
    return { suggestions: result.suggestions };

  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred during font identification.' };
  }
}

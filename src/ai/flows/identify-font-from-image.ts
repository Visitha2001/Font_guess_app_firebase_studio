'use server';
/**
 * @fileOverview Font identification flow that suggests the top three most probable font matches from an image.
 *
 * - identifyFontFromImage - A function that handles the font identification process.
 * - IdentifyFontFromImageInput - The input type for the identifyFontFromImage function.
 * - IdentifyFontFromImageOutput - The return type for the identifyFontFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFontFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo containing text, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFontFromImageInput = z.infer<typeof IdentifyFontFromImageInputSchema>;

const IdentifyFontFromImageOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      fontName: z.string().describe('The name of the suggested font.'),
      confidenceLevel: z
        .number()
        .describe('The confidence level of the suggestion (0-1).'),
      purchaseLink: z.string().describe('A link to where the font can be obtained.'),
    })
  ).describe('The top three most probable font matches.'),
});
export type IdentifyFontFromImageOutput = z.infer<typeof IdentifyFontFromImageOutputSchema>;

export async function identifyFontFromImage(input: IdentifyFontFromImageInput): Promise<IdentifyFontFromImageOutput> {
  return identifyFontFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyFontFromImagePrompt',
  input: {schema: IdentifyFontFromImageInputSchema},
  output: {schema: IdentifyFontFromImageOutputSchema},
  prompt: `You are a font identification expert. Given an image of text, identify the font and provide the top three most probable matches, including a confidence level (0-1) and a link to where the font can be obtained. Respond in JSON format.

Image: {{media url=photoDataUri}}

Ensure the confidence level is a floating point number between 0 and 1.
`,
});

const identifyFontFromImageFlow = ai.defineFlow(
  {
    name: 'identifyFontFromImageFlow',
    inputSchema: IdentifyFontFromImageInputSchema,
    outputSchema: IdentifyFontFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

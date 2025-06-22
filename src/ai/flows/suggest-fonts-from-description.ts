'use server';
/**
 * @fileOverview An AI agent that suggests fonts based on a description.
 *
 * - suggestFontsFromDescription - A function that suggests fonts based on a description.
 * - SuggestFontsFromDescriptionInput - The input type for the suggestFontsFromDescription function.
 * - SuggestFontsFromDescriptionOutput - The return type for the suggestFontsFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFontsFromDescriptionInputSchema = z.object({
  description: z.string().describe('The description of the font.'),
});
export type SuggestFontsFromDescriptionInput = z.infer<typeof SuggestFontsFromDescriptionInputSchema>;

const SuggestFontsFromDescriptionOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      fontName: z.string().describe('The name of the font.'),
      confidence: z.number().describe('The confidence level of the suggestion (0-1).'),
      purchaseUrl: z.string().describe('The URL where the font can be purchased.'),
    })
  ).describe('A list of font suggestions.'),
});
export type SuggestFontsFromDescriptionOutput = z.infer<typeof SuggestFontsFromDescriptionOutputSchema>;

export async function suggestFontsFromDescription(input: SuggestFontsFromDescriptionInput): Promise<SuggestFontsFromDescriptionOutput> {
  return suggestFontsFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFontsFromDescriptionPrompt',
  input: {schema: SuggestFontsFromDescriptionInputSchema},
  output: {schema: SuggestFontsFromDescriptionOutputSchema},
  prompt: `You are a font expert. Given the following description, suggest three fonts that match the description.

Description: {{{description}}}

For each font, provide the font name, a confidence level (0-1), and a URL where the font can be purchased.
Return the output as a JSON object.`,
});

const suggestFontsFromDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestFontsFromDescriptionFlow',
    inputSchema: SuggestFontsFromDescriptionInputSchema,
    outputSchema: SuggestFontsFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

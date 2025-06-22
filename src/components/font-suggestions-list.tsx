"use client";

import { FontSuggestionCard } from "./font-suggestion-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { IdentifyFontFromImageOutput } from "@/ai/flows/identify-font-from-image";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface FontSuggestionsListProps {
  suggestions: IdentifyFontFromImageOutput['suggestions'] | null;
  isLoading: boolean;
  error: string | null;
}

function SuggestionSkeleton() {
  return (
    <div className="w-full rounded-lg border bg-card text-card-foreground p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
        </div>
        <Skeleton className="h-2.5 w-full" />
      </div>
      <div className="flex justify-between gap-2 pt-4">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

export function FontSuggestionsList({ suggestions, isLoading, error }: FontSuggestionsListProps) {
    
  if (isLoading) {
    return (
      <section aria-live="polite" aria-busy="true" className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-headline mb-6 text-center">Identifying your font...</h2>
        <div className="grid gap-6 md:grid-cols-2">
            <SuggestionSkeleton />
            <SuggestionSkeleton />
            <SuggestionSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <section aria-live="polite" className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold font-headline mb-6 text-center">We found these fonts!</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <FontSuggestionCard key={index} suggestion={suggestion} />
        ))}
      </div>
    </section>
  );
}

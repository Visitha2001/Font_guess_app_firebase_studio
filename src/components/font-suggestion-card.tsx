"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type FontSuggestion = {
  fontName: string;
  confidenceLevel: number;
  purchaseLink: string;
};

interface FontSuggestionCardProps {
  suggestion: FontSuggestion;
}

export function FontSuggestionCard({ suggestion }: FontSuggestionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.fontName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confidencePercent = Math.round(suggestion.confidenceLevel * 100);

  return (
    <Card className="w-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-xl truncate" title={suggestion.fontName}>{suggestion.fontName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-baseline">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-sm font-medium text-foreground">{confidencePercent}%</p>
        </div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <Progress value={confidencePercent} aria-label={`${confidencePercent}% confidence`} />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{confidencePercent}% confidence</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="secondary" size="sm" onClick={handleCopy} className="transition-all w-[110px]">
          {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button asChild size="sm">
          <a href={suggestion.purchaseLink} target="_blank" rel="noopener noreferrer">
            Get Font <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

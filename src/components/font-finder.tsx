"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { identifyFontAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { FontSuggestionsList } from "./font-suggestions-list";
import { Sparkles, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import type { IdentifyFontFromImageOutput } from "@/ai/flows/identify-font-from-image";

const formSchema = z.object({
  imageFile: z.instanceof(File).optional(),
  imageUrl: z.string().url("Please enter a valid URL.").optional(),
}).refine(data => data.imageFile || data.imageUrl, {
    message: "Please upload an image or provide a URL.",
    path: ["imageFile"],
});

type FormValues = z.infer<typeof formSchema>;

export function FontFinder() {
  const [suggestions, setSuggestions] = useState<IdentifyFontFromImageOutput['suggestions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const {
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("imageFile", file, { shouldValidate: true });
      resetField("imageUrl");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const url = event.target.value;
      setValue("imageUrl", url, { shouldValidate: true });
      if (url) {
          resetField("imageFile");
          setImagePreview(url);
      } else if (!watch("imageFile")) {
          setImagePreview(null);
      }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
        let imageDataUri: string | undefined;

        if (data.imageFile) {
            imageDataUri = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(data.imageFile!);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            });
        }

        const result = await identifyFontAction({ 
            imageDataUri: imageDataUri, 
            imageUrl: data.imageUrl 
        });
        
        if ('error' in result) {
            setError(result.error);
        } else {
            setSuggestions(result.suggestions);
        }
    } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Identify a Font</CardTitle>
          <CardDescription>Upload an image or paste a URL to find out what font is used.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </TabsTrigger>
                <TabsTrigger value="url">
                  <LinkIcon className="mr-2 h-4 w-4" /> Use URL
                </TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="pt-4">
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Image File</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer file:text-primary file:font-medium"
                    onChange={handleFileChange}
                  />
                </div>
              </TabsContent>
              <TabsContent value="url" className="pt-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="text"
                    placeholder="https://example.com/image.png"
                    onChange={handleUrlChange}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            {(errors.imageFile || errors.imageUrl) && <p className="text-sm text-destructive mt-2">{errors.imageFile?.message || errors.imageUrl?.message}</p>}

            <div className="mt-4">
              {imagePreview ? (
                <div className="border rounded-lg p-2 bg-muted/30">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="contain" />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 bg-muted/30 flex flex-col items-center justify-center text-center text-muted-foreground h-48">
                    <ImageIcon className="w-12 h-12 mb-2 text-muted-foreground/50"/>
                    <p>Your image preview will appear here</p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isLoading || (!watch('imageFile') && !watch('imageUrl'))} className="w-full mt-6">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Identifying...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Snap Font
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <FontSuggestionsList suggestions={suggestions} isLoading={isLoading} error={error} />
    </div>
  );
}

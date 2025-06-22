import { FontFinder } from "@/components/font-finder";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <header className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-primary">
              FontSnap
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ever seen a font you love but couldn't name? Snap it, and we'll identify it for you in seconds.
            </p>
          </header>

          <FontFinder />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Built with Next.js and ❤️. A Firebase Studio creation.</p>
      </footer>
    </div>
  );
}

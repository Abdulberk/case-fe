import { Heart, Code2, GitFork } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          {/* Left — Branding */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Code2 className="h-4 w-4" />
            <span>Characters Explorer</span>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <span className="text-xs">© {new Date().getFullYear()}</span>
          </div>

          {/* Center — Made with love */}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Built with
            <Heart className="h-3 w-3 fill-destructive text-destructive" />
            using Next.js &amp; GraphQL
          </p>

          {/* Right — Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <GitFork className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

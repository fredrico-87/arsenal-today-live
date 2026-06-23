import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Tv, Calendar, Newspaper, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/live", label: "Live", icon: Tv },
    { href: "/fixtures", label: "Fixtures", icon: Calendar },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/community", label: "Community", icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:bg-accent transition-colors">
              A
            </div>
            <span className="font-bold text-xl tracking-tight">Arsenal<span className="text-primary group-hover:text-accent transition-colors">today</span>live</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              A
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Arsenal<span className="text-primary">today</span>live</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            The digital home for Gooners worldwide. Built by famianojumbo. Raw, proud, and uncompromisingly Arsenal.
          </p>
          <div className="flex justify-center gap-6 text-sm font-medium">
            <Link href="/live" className="text-muted-foreground hover:text-primary transition-colors">Live Streams</Link>
            <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">Latest News</Link>
            <Link href="/community" className="text-muted-foreground hover:text-primary transition-colors">Fan Community</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card pb-safe z-50">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-12 rounded-lg text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive ? "text-primary" : "")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

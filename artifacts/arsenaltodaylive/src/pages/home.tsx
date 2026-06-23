import { useListMatches, useListStreams, useListNews, getListMatchesQueryKey, getListStreamsQueryKey, getListNewsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { PlayCircle, Clock, ChevronRight, MessageSquare, ArrowUpRight, Newspaper, Tv } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: matches, isLoading: matchesLoading } = useListMatches({}, { query: { queryKey: getListMatchesQueryKey({}) } });
  const { data: streams, isLoading: streamsLoading } = useListStreams({ query: { queryKey: getListStreamsQueryKey() } });
  const { data: news, isLoading: newsLoading } = useListNews({ limit: 3 }, { query: { queryKey: getListNewsQueryKey({ limit: 3 }) } });

  const nextMatch = matches?.find(m => m.status === "upcoming");
  const recentMatch = [...(matches || [])].reverse().find(m => m.status === "completed");
  const liveStreams = streams?.filter(s => s.isLive) || [];

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card border-b border-border py-16 md:py-24">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-primary hover:bg-primary text-primary-foreground mb-6 uppercase tracking-wider text-xs px-3 py-1 font-bold">
              Matchday Energy
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 uppercase leading-none">
              The Digital Home<br />
              <span className="text-primary">For Real Gooners</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Live streams, relentless news, and a community pulsing with the pride of North London. Stop scrolling. You're home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="font-bold uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/live">Watch Live</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold uppercase tracking-wide border-primary text-primary hover:bg-primary/10">
                <Link href="/community">Join the Roar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Next Match & Streams */}
        <div className="lg:col-span-8 space-y-12">
          {/* Next Match */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                <CalendarIcon className="text-primary w-6 h-6" /> Next Fixture
              </h2>
              <Link href="/fixtures" className="text-sm font-medium text-primary hover:text-accent flex items-center transition-colors">
                All Fixtures <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            {matchesLoading ? (
              <Skeleton className="w-full h-48 rounded-xl bg-card" />
            ) : nextMatch ? (
              <Card className="bg-card border-border overflow-hidden relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                <CardContent className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <Badge variant="outline" className="text-muted-foreground border-border uppercase font-bold text-xs tracking-wider">
                      {nextMatch.competition}
                    </Badge>
                    <div className="flex items-center text-muted-foreground text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 mr-2 text-primary" />
                      {new Date(nextMatch.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-6 md:gap-12">
                    <div className="text-center flex-1">
                      <div className="text-3xl md:text-5xl font-black uppercase text-foreground mb-2 truncate">
                        {nextMatch.isHome ? "Arsenal" : nextMatch.opponent}
                      </div>
                      <div className="text-muted-foreground text-sm font-bold uppercase">{nextMatch.isHome ? "Home" : "Away"}</div>
                    </div>
                    <div className="text-xl md:text-3xl font-black text-primary px-4">VS</div>
                    <div className="text-center flex-1">
                      <div className="text-3xl md:text-5xl font-black uppercase text-foreground mb-2 truncate">
                        {!nextMatch.isHome ? "Arsenal" : nextMatch.opponent}
                      </div>
                      <div className="text-muted-foreground text-sm font-bold uppercase">{!nextMatch.isHome ? "Away" : "Home"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center text-muted-foreground font-medium uppercase tracking-widest">
                  No upcoming matches scheduled
                </CardContent>
              </Card>
            )}
          </section>

          {/* Live Streams */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Tv className="text-primary w-6 h-6" /> Live Now
              </h2>
              <Link href="/live" className="text-sm font-medium text-primary hover:text-accent flex items-center transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {streamsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-48 rounded-xl bg-card" />
                <Skeleton className="h-48 rounded-xl bg-card" />
              </div>
            ) : liveStreams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveStreams.slice(0, 2).map((stream) => (
                  <Link key={stream.id} href="/live">
                    <Card className="bg-card border-border overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                      <div className="aspect-video bg-secondary relative">
                        {stream.thumbnailUrl ? (
                          <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <PlayCircle className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="bg-primary text-white animate-pulse uppercase font-bold text-xs tracking-wider">LIVE</Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{stream.title}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center text-muted-foreground font-medium uppercase tracking-widest flex flex-col items-center">
                  <Tv className="w-12 h-12 mb-4 opacity-20" />
                  No streams live right now
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Right Column: Recent Result & News */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Recent Result */}
          {recentMatch && (
            <section>
              <h2 className="text-xl font-bold uppercase tracking-tight mb-6">Latest Result</h2>
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    {recentMatch.competition}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xl uppercase truncate flex-1">{recentMatch.isHome ? "ARS" : recentMatch.opponent}</div>
                    <div className="bg-secondary text-primary font-black text-2xl px-4 py-1 rounded mx-4">
                      {recentMatch.isHome ? recentMatch.arsenalScore : recentMatch.opponentScore} - {recentMatch.isHome ? recentMatch.opponentScore : recentMatch.arsenalScore}
                    </div>
                    <div className="font-bold text-xl uppercase truncate flex-1 text-right">{!recentMatch.isHome ? "ARS" : recentMatch.opponent}</div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Latest News */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Newspaper className="text-primary w-5 h-5" /> Headlines
              </h2>
            </div>
            
            <div className="space-y-4">
              {newsLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl bg-card" />)
              ) : news && news.length > 0 ? (
                news.map((article) => (
                  <Link key={article.id} href={`/news/${article.id}`}>
                    <Card className="bg-card border-border hover:border-primary/50 transition-colors group cursor-pointer">
                      <CardContent className="p-4 flex gap-4">
                        {article.imageUrl && (
                          <img src={article.imageUrl} alt={article.title} className="w-20 h-20 object-cover rounded bg-secondary flex-shrink-0" />
                        )}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{article.category.replace('_', ' ')}</span>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center p-6 bg-card rounded-xl border border-border text-muted-foreground uppercase font-bold text-sm tracking-wider">
                  No recent news
                </div>
              )}
            </div>
            {news && news.length > 0 && (
              <Button asChild variant="outline" className="w-full mt-6 border-border text-foreground hover:bg-secondary uppercase font-bold tracking-wide">
                <Link href="/news">Read All News</Link>
              </Button>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

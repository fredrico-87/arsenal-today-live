import { useListStreams, getListStreamsQueryKey } from "@workspace/api-client-react";
import { Tv, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Live() {
  const { data: streams, isLoading } = useListStreams({ query: { queryKey: getListStreamsQueryKey() } });

  const liveStreams = streams?.filter(s => s.isLive) || [];
  const upcomingStreams = streams?.filter(s => !s.isLive) || [];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground flex items-center gap-4">
          <Tv className="w-10 h-10 text-primary" />
          Live Streams
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg font-medium">
          Catch every moment of the action. High-quality streams for the Arsenal faithful.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-xl bg-card" />)}
        </div>
      ) : (
        <div className="space-y-12">
          {liveStreams.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <h2 className="text-2xl font-bold uppercase tracking-wide">Live Now</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </section>
          )}

          {upcomingStreams.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 text-muted-foreground">Upcoming & Replays</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </section>
          )}

          {streams?.length === 0 && (
            <div className="text-center py-24 bg-card rounded-2xl border border-border">
              <Tv className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-muted-foreground mb-2">No Streams Available</h3>
              <p className="text-muted-foreground">Check back closer to kickoff.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StreamCard({ stream }: { stream: any }) {
  return (
    <Card className="bg-card border-border overflow-hidden group">
      <div className="aspect-video bg-secondary relative overflow-hidden">
        {stream.thumbnailUrl ? (
          <img 
            src={stream.thumbnailUrl} 
            alt={stream.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <PlayCircle className="w-16 h-16 text-muted-foreground/50 group-hover:text-primary transition-colors" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Button size="icon" variant="ghost" className="w-16 h-16 rounded-full border-2 border-white text-white hover:bg-primary hover:border-primary hover:text-white scale-90 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100">
            <PlayCircle className="w-8 h-8" />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          {stream.isLive ? (
            <Badge className="bg-primary hover:bg-primary text-white animate-pulse uppercase font-bold text-xs tracking-wider border-none">LIVE</Badge>
          ) : (
            <Badge variant="secondary" className="uppercase font-bold text-xs tracking-wider">OFFLINE</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors mb-2">
          {stream.title}
        </h3>
      </CardContent>
    </Card>
  );
}

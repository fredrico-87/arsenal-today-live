import { useListMatches, getListMatchesQueryKey } from "@workspace/api-client-react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Fixtures() {
  const { data: matches, isLoading } = useListMatches({}, { query: { queryKey: getListMatchesQueryKey({}) } });

  const upcoming = matches?.filter(m => m.status === "upcoming") || [];
  const results = [...(matches?.filter(m => m.status === "completed") || [])].reverse();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground flex items-center gap-4">
          <Calendar className="w-10 h-10 text-primary" />
          Fixtures & Results
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl bg-card" />)}
        </div>
      ) : (
        <div className="space-y-16">
          {/* Upcoming Matches */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-wide mb-6">Upcoming Matches</h2>
            {upcoming.length > 0 ? (
              <div className="space-y-4">
                {upcoming.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-card rounded-xl border border-border text-muted-foreground uppercase font-bold tracking-wider">
                No upcoming matches scheduled
              </div>
            )}
          </section>

          {/* Results */}
          <section>
            <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 text-muted-foreground">Recent Results</h2>
            {results.length > 0 ? (
              <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
                {results.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-card rounded-xl border border-border text-muted-foreground uppercase font-bold tracking-wider">
                No recent results
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function MatchRow({ match }: { match: any }) {
  const date = new Date(match.date);
  const isComplete = match.status === "completed";
  
  // Quick win check
  const arsenalWon = isComplete && match.arsenalScore > match.opponentScore;
  const arsenalLost = isComplete && match.arsenalScore < match.opponentScore;
  
  return (
    <Card className={cn(
      "bg-card border-border overflow-hidden transition-all",
      isComplete && arsenalWon ? "border-l-4 border-l-green-500" : "",
      isComplete && arsenalLost ? "border-l-4 border-l-destructive" : "",
      !isComplete ? "border-l-4 border-l-primary hover:border-primary/50" : ""
    )}>
      <CardContent className="p-0 sm:flex items-center">
        {/* Date block */}
        <div className="bg-secondary/50 p-4 sm:w-32 flex sm:flex-col items-center justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-border shrink-0">
          <div className="text-center">
            <div className="font-bold text-sm uppercase text-muted-foreground">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div className="font-black text-2xl leading-none my-1">{date.getDate()}</div>
            <div className="font-bold text-sm uppercase text-muted-foreground">{date.toLocaleDateString(undefined, { month: 'short' })}</div>
          </div>
          <div className="sm:hidden flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase">
            <Clock className="w-4 h-4" />
            {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Match details */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="uppercase font-bold text-[10px] tracking-wider border-border">
                {match.competition}
              </Badge>
              {match.venue && (
                <span className="text-xs text-muted-foreground flex items-center uppercase font-bold tracking-wider">
                  <MapPin className="w-3 h-3 mr-1" /> {match.venue}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 text-right">
                <span className={cn("text-lg sm:text-2xl font-black uppercase truncate", match.isHome ? "text-primary" : "")}>
                  {match.isHome ? "Arsenal" : match.opponent}
                </span>
              </div>
              
              <div className="px-4 py-2 bg-secondary rounded-lg font-black text-xl sm:text-2xl min-w-[80px] text-center">
                {isComplete ? (
                  <span>{match.isHome ? match.arsenalScore : match.opponentScore} - {match.isHome ? match.opponentScore : match.arsenalScore}</span>
                ) : (
                  <span className="text-muted-foreground text-sm flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1 hidden sm:block" />
                    {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <span className={cn("text-lg sm:text-2xl font-black uppercase truncate", !match.isHome ? "text-primary" : "")}>
                  {!match.isHome ? "Arsenal" : match.opponent}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

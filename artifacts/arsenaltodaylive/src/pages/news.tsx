import { useListNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Newspaper, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

export default function News() {
  const [category, setCategory] = useState<string>("all");
  
  const queryParams = category === "all" ? {} : { category: category as any };
  const { data: news, isLoading } = useListNews(queryParams, { query: { queryKey: getListNewsQueryKey(queryParams) } });

  const categories = [
    { id: "all", label: "All News" },
    { id: "transfer", label: "Transfers" },
    { id: "match_preview", label: "Previews" },
    { id: "match_report", label: "Reports" },
    { id: "general", label: "General" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground flex items-center gap-4">
          <Newspaper className="w-10 h-10 text-primary" />
          Latest News
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg font-medium">
          Breaking news, tactical analysis, and the latest transfer rumors.
        </p>
      </div>

      <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="mb-8">
        <TabsList className="bg-secondary flex-wrap h-auto p-1 gap-1 border border-border">
          {categories.map(c => (
            <TabsTrigger 
              key={c.id} 
              value={c.id}
              className="uppercase font-bold tracking-wider text-xs px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-xl bg-card" />)}
        </div>
      ) : news && news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article, i) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <Card className="bg-card border-border overflow-hidden hover:border-primary transition-all group h-full flex flex-col cursor-pointer">
                {article.imageUrl ? (
                  <div className="aspect-video relative overflow-hidden bg-secondary">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-background/80 backdrop-blur text-foreground uppercase font-bold text-[10px] tracking-wider border-none">
                        {article.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <CardHeader className="pb-0 pt-6">
                    <Badge variant="outline" className="w-fit uppercase font-bold text-[10px] tracking-wider border-border mb-2">
                      {article.category.replace('_', ' ')}
                    </Badge>
                  </CardHeader>
                )}
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground pt-4 border-t border-border">
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center text-primary group-hover:text-accent transition-colors">
                      Read <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center p-16 bg-card rounded-2xl border border-border text-muted-foreground">
          <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold uppercase tracking-widest text-foreground mb-2">No Articles Found</h3>
          <p>We couldn't find any news in this category right now.</p>
        </div>
      )}
    </div>
  );
}

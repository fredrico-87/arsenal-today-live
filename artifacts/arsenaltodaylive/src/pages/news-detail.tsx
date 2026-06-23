import { useParams, Link } from "wouter";
import { useGetArticle, getGetArticleQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function NewsDetail() {
  const params = useParams();
  const id = Number(params.id);
  
  const { data: article, isLoading } = useGetArticle(id, { query: { enabled: !!id, queryKey: getGetArticleQueryKey(id) } });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="w-24 h-8 mb-8" />
        <Skeleton className="w-full h-12 mb-4" />
        <Skeleton className="w-3/4 h-12 mb-8" />
        <Skeleton className="w-full aspect-video rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/news">Back to News</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="pb-24">
      {/* Header */}
      <header className="bg-card border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/news" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
          </Link>
          
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 uppercase font-bold text-xs tracking-wider mb-6 border-none px-3 py-1">
            {article.category.replace('_', ' ')}
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6 text-foreground">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="flex items-center text-muted-foreground font-medium text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(article.publishedAt).toLocaleDateString(undefined, { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10 mb-12">
          <div className="aspect-[21/9] rounded-xl overflow-hidden border-4 border-card shadow-2xl bg-secondary">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl mt-12">
        {article.excerpt && (
          <p className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed mb-10 border-l-4 border-primary pl-6 py-2">
            {article.excerpt}
          </p>
        )}
        
        <div className="prose prose-invert prose-lg max-w-none text-foreground/90 font-serif leading-relaxed">
          {/* We're splitting by newline to create basic paragraphs since we don't have a real markdown parser setup */}
          {article.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

import { useListPosts, useCreatePost, getListPostsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Users, Send, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  author: z.string().min(2, "Name must be at least 2 characters").max(50),
  content: z.string().min(5, "Message must be at least 5 characters").max(500),
});

export default function Community() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // NOTE: Assuming useListPosts exists and returns Post[] based on prompt
  const { data: posts, isLoading } = useListPosts({ query: { queryKey: getListPostsQueryKey() } });
  const createPost = useCreatePost();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPost.mutate({ data: values }, {
      onSuccess: () => {
        toast({
          title: "Post sent!",
          description: "Your voice has been added to the roar.",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send post. Try again.",
        });
      }
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="mb-10 text-center">
        <Badge className="bg-primary/20 text-primary hover:bg-primary/20 uppercase tracking-widest font-bold mb-4">The North Bank</Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground flex flex-col sm:flex-row items-center justify-center gap-4">
          <Users className="w-12 h-12 text-primary hidden sm:block" />
          Fan Community
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg font-medium">
          Have your say. Connect with Gooners around the world. No corporate filter, just raw passion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Post Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <Card className="bg-card border-border shadow-xl">
            <CardHeader className="bg-secondary/50 border-b border-border pb-4">
              <CardTitle className="uppercase font-black tracking-wide flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Have your say
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. HighburyHero" className="bg-background border-border focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-muted-foreground tracking-wider">Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What's on your mind?" 
                            className="bg-background border-border focus-visible:ring-primary resize-none h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full uppercase font-bold tracking-widest bg-primary hover:bg-primary/90 text-white"
                    disabled={createPost.isPending}
                  >
                    {createPost.isPending ? "Sending..." : "Post Message"} <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Feed */}
        <div className="lg:col-span-8 space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6 flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-full h-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6 sm:p-8 flex gap-4 sm:gap-6">
                  <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-primary/20 bg-secondary shrink-0">
                    <AvatarFallback className="bg-secondary text-primary font-black uppercase text-lg">
                      {post.author.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-2 sm:mb-3">
                      <h3 className="font-bold text-foreground truncate text-lg">{post.author}</h3>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground/90 text-sm sm:text-base leading-relaxed break-words">
                      {post.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-16 bg-card rounded-2xl border border-border text-muted-foreground">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-foreground mb-2">No Posts Yet</h3>
              <p>Be the first to spark the conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary inline Badge component since it's not imported at the top
function Badge({ className, children, ...props }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

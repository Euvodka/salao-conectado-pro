
import { useState, useEffect } from "react";
import { PostCard } from "@/components/feed/PostCard";
import { ClientNavbar } from "@/components/client/ClientNavbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Mock data for posts
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    professionalId: "101",
    professionalName: "Salão Beleza Total",
    professionalImage: "https://images.unsplash.com/photo-1580618864194-0fb637e8f5da?q=80&w=1469&auto=format&fit=crop",
    content: "Transformação completa! Corte + mechas + tratamento. Agende seu horário!",
    image: "https://images.unsplash.com/photo-1595163153849-537b3572145c?q=80&w=1470&auto=format&fit=crop",
    likes: 42,
    comments: 5,
    createdAt: "2023-04-10T14:48:00",
  },
  {
    id: "2",
    professionalId: "102",
    professionalName: "Studio Márcia Hair",
    professionalImage: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=1374&auto=format&fit=crop",
    content: "Penteado para noivas e madrinhas! Preparada para o grande dia? 👰🏻‍♀️✨",
    image: "https://images.unsplash.com/photo-1523263685509-57c1d050d19b?q=80&w=1470&auto=format&fit=crop",
    likes: 87,
    comments: 12,
    createdAt: "2023-04-09T09:30:00",
  },
  {
    id: "3",
    professionalId: "103",
    professionalName: "Nails Design",
    professionalImage: "https://images.unsplash.com/photo-1634283144126-a43aa004da84?q=80&w=1374&auto=format&fit=crop",
    content: "Unhas em gel com nail art exclusivo! Qual é o seu favorito? 💅",
    image: "https://images.unsplash.com/photo-1636018943957-6eb25813fde8?q=80&w=1470&auto=format&fit=crop",
    likes: 63,
    comments: 8,
    createdAt: "2023-04-08T16:15:00",
  },
];

export default function ClientFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Simulate API fetch
    const fetchPosts = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(MOCK_POSTS);
        
        // Get saved posts from localStorage if available
        const savedPostsStr = localStorage.getItem('savedPosts');
        if (savedPostsStr) {
          setSavedPosts(JSON.parse(savedPostsStr));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);
  
  const handleSavePost = (post: Post) => {
    const newSavedPosts = [...savedPosts];
    
    // Check if post is already saved
    const existingIndex = newSavedPosts.findIndex(p => p.id === post.id);
    
    if (existingIndex === -1) {
      // If not saved, add it
      newSavedPosts.push(post);
      toast({
        title: "Post salvo",
        description: "O post foi adicionado à sua lista de salvos"
      });
    }
    
    setSavedPosts(newSavedPosts);
    
    // Save to localStorage
    localStorage.setItem('savedPosts', JSON.stringify(newSavedPosts));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <ClientNavbar />
      
      <main className="container max-w-2xl mx-auto px-4 pt-4 pb-20 md:pt-6">
        {/* Stories section - Simplistic version */}
        <div className="flex overflow-x-auto gap-4 py-4 px-1 no-scrollbar">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-salon-400 to-salon-600 p-0.5">
                <div className="bg-white w-full h-full rounded-full p-0.5">
                  <div className="bg-gray-200 w-full h-full rounded-full"></div>
                </div>
              </div>
              <span className="text-xs mt-1 text-gray-600 truncate w-16 text-center">Profissional {i+1}</span>
            </div>
          ))}
        </div>

        {/* Content feed */}
        <div className="mt-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 mt-2 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="aspect-video bg-gray-200 rounded-md mb-4"></div>
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                userRole="client" 
                onSave={(post) => handleSavePost(post)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

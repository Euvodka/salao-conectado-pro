
import { useState, useEffect } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { PostCard } from "@/components/feed/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Post } from "@/types";
import { useToast } from "@/components/ui/use-toast";

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

export default function ProfessionalFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [newPost, setNewPost] = useState({
    content: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchPosts = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPosts(MOCK_POSTS);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Adicione uma descrição para sua publicação.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new post
      const newPostObject: Post = {
        id: `new-${Date.now()}`,
        professionalId: user?.id || "1",
        professionalName: user?.name || "Profissional",
        professionalImage: user?.profileImage || "",
        content: newPost.content,
        image: newPost.imageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1470&auto=format&fit=crop",
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      };
      
      // Add to the beginning of the posts array
      setPosts(prev => [newPostObject, ...prev]);
      
      // Reset form and close dialog
      setNewPost({
        content: "",
        imageUrl: "",
      });
      setIsOpen(false);
      
      toast({
        title: "Publicação criada!",
        description: "Sua publicação foi adicionada ao feed.",
      });
    } catch (error) {
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível criar sua publicação. Tente novamente.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <main className="container max-w-2xl mx-auto px-4 pt-4 pb-20 md:pt-6">
        {/* Create post card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <CustomDialog
              open={isOpen}
              onOpenChange={setIsOpen}
              trigger={
                <div className="flex items-center space-x-3 cursor-pointer p-3 rounded-md hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <Image className="h-6 w-6 text-salon-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500">Compartilhe seu trabalho...</p>
                  </div>
                  <Button>Criar Post</Button>
                </div>
              }
              title="Nova Publicação"
              description="Compartilhe seu trabalho e destaque seus serviços para atrair novos clientes."
              footer={
                <>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publicando...
                      </>
                    ) : (
                      "Publicar"
                    )}
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Descrição*</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={newPost.content}
                    onChange={handleInputChange}
                    placeholder="Descreva o seu trabalho..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da imagem</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={newPost.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole o link da imagem ou suba uma foto do seu trabalho.
                  </p>
                </div>
                
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6 text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arraste e solte uma imagem ou clique para selecionar
                  </p>
                  <Button variant="outline" type="button" size="sm">
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>
            </CustomDialog>
          </CardContent>
        </Card>

        {/* Content feed */}
        <div>
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
              <PostCard key={post.id} post={post} userRole="professional" />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

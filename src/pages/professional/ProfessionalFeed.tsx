import { useState, useEffect, useRef } from "react";
import { ProfessionalNavbar } from "@/components/professional/ProfessionalNavbar";
import { PostCard } from "@/components/feed/PostCard";
import { CommentSection } from "@/components/feed/CommentSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Image, Loader2, MessageSquare, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Post } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const sampleComments = [
  {
    id: "c1",
    author: {
      name: "Mariana Costa",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1471&auto=format&fit=crop",
    },
    content: "Ficou incrível! Quero marcar um horário para fazer igual.",
    createdAt: "Há 2 horas",
  },
  {
    id: "c2",
    author: {
      name: "Pedro Alves",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop",
    },
    content: "Adorei o resultado! Qual marca de produtos você usa?",
    createdAt: "Há 1 dia",
  }
];

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

type PostWithComments = Post & {
  commentList?: {
    id: string;
    author: {
      name: string;
      avatar?: string;
    };
    content: string;
    createdAt: string;
  }[];
};

export default function ProfessionalFeed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostWithComments[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPost, setNewPost] = useState({
    content: "",
    imageUrl: "",
    imageFile: null as File | null,
    imagePreview: null as string | null,
    linkedServiceId: "" as string | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const postsWithComments = MOCK_POSTS.map(post => ({
          ...post,
          commentList: post.id === "1" ? sampleComments : [],
        }));
        
        setPosts(postsWithComments);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPost(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = e.target.value;
    setNewPost(prev => ({
      ...prev,
      linkedServiceId: serviceId === "" ? null : serviceId
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
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const linkedService = user?.services?.find(s => s.id === newPost.linkedServiceId);
      
      const newPostObject: PostWithComments = {
        id: `new-${Date.now()}`,
        professionalId: user?.id || "1",
        professionalName: user?.name || "Profissional",
        professionalImage: user?.profileImage || "",
        content: newPost.content,
        image: newPost.imagePreview || newPost.imageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1470&auto=format&fit=crop",
        linkedService: linkedService,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        commentList: [],
      };
      
      setPosts(prev => [newPostObject, ...prev]);
      
      setNewPost({
        content: "",
        imageUrl: "",
        imageFile: null,
        imagePreview: null,
        linkedServiceId: null,
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

  const handleSavePost = (postId: string) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
      toast({
        title: "Publicação removida",
        description: "Publicação removida dos salvos."
      });
    } else {
      setSavedPosts([...savedPosts, postId]);
      toast({
        title: "Publicação salva",
        description: "Publicação adicionada aos salvos."
      });
    }
  };

  const handleViewComments = (postId: string) => {
    setSelectedPost(postId);
  };

  const handleCloseComments = () => {
    setSelectedPost(null);
  };

  const handleAddComment = (postId: string, comment: string) => {
    if (!comment.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment-${Date.now()}`,
          author: {
            name: user?.name || "Você",
            avatar: user?.profileImage,
          },
          content: comment,
          createdAt: "Agora",
        };
        
        return {
          ...post,
          comments: post.comments + 1,
          commentList: [...(post.commentList || []), newComment],
        };
      }
      return post;
    }));
  };

  const getPostComments = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.commentList || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <ProfessionalNavbar />
      
      <main className="container max-w-2xl mx-auto px-4 pt-4 pb-20 md:pt-6">
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'feed'
                ? 'text-salon-600 border-b-2 border-salon-600'
                : 'text-gray-500 hover:text-salon-500'
            }`}
            onClick={() => setActiveTab('feed')}
          >
            Feed
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'saved'
                ? 'text-salon-600 border-b-2 border-salon-600'
                : 'text-gray-500 hover:text-salon-500'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            Salvos
          </button>
        </div>
        
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
                  <Label htmlFor="linkedService">Vincular serviço (opcional)</Label>
                  <select
                    id="linkedService"
                    name="linkedService"
                    value={newPost.linkedServiceId || ""}
                    onChange={handleServiceSelect}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Selecione um serviço</option>
                    {user?.services?.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {!newPost.imagePreview && (
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
                )}
                
                {newPost.imagePreview ? (
                  <div className="relative">
                    <img 
                      src={newPost.imagePreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-md" 
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => setNewPost(prev => ({ ...prev, imagePreview: null, imageFile: null }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="bg-gray-50 border border-dashed border-gray-200 rounded-md p-6 text-center cursor-pointer"
                    onClick={handleFileSelectClick}
                  >
                    <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arraste e solte uma imagem ou clique para selecionar
                    </p>
                    <Button variant="outline" type="button" size="sm">
                      Selecionar Arquivo
                    </Button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </CustomDialog>
          </CardContent>
        </Card>

        {selectedPost && (
          <CustomDialog
            open={!!selectedPost}
            onOpenChange={() => setSelectedPost(null)}
            title="Comentários"
            description="Veja e responda aos comentários da sua publicação."
          >
            <CommentSection 
              postId={selectedPost} 
              initialComments={getPostComments(selectedPost)}
              onClose={handleCloseComments}
            />
          </CustomDialog>
        )}

        <div>
          {isLoading ? (
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
          ) : activeTab === 'feed' ? (
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id}>
                  <PostCard 
                    post={post} 
                    userRole="professional" 
                    isSaved={savedPosts.includes(post.id)}
                    onSave={() => handleSavePost(post.id)}
                    onCommentClick={() => handleViewComments(post.id)}
                  />
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-center p-8 border rounded-md bg-white">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem publicações</h3>
                  <p className="text-muted-foreground mb-4">
                    Não há publicações para exibir no momento.
                  </p>
                  <Button onClick={() => setIsOpen(true)}>Criar Publicação</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.filter(post => savedPosts.includes(post.id)).map(post => (
                <div key={post.id}>
                  <PostCard 
                    post={post} 
                    userRole="professional" 
                    isSaved={true}
                    onSave={() => handleSavePost(post.id)}
                    onCommentClick={() => handleViewComments(post.id)}
                  />
                </div>
              ))}
              {savedPosts.length === 0 && (
                <div className="text-center p-8 border rounded-md bg-white">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem publicações salvas</h3>
                  <p className="text-muted-foreground mb-4">
                    Você ainda não salvou nenhuma publicação.
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('feed')}>Voltar para o Feed</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

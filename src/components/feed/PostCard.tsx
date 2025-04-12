
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, MessageSquare, Share2, Bookmark, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CommentSection } from "./CommentSection";
import { Post } from "@/types";
import { CustomDialog } from "@/components/ui/custom-dialog";

interface PostCardProps {
  post: Post;
  userRole: 'client' | 'professional';
  isSaved?: boolean;
  onSave?: () => void;
  onCommentClick?: () => void;
}

export function PostCard({ post, userRole, isSaved = false, onSave, onCommentClick }: PostCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const formattedDate = () => {
    try {
      return formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch (error) {
      return "recentemente";
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleShare = () => {
    toast({
      title: "Compartilhar",
      description: "Link copiado para a área de transferência!",
    });
  };

  const handleProfessionalClick = () => {
    if (userRole === 'client') {
      navigate(`/professionals/${post.professionalId}`);
    }
  };

  const handlePostOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleEditPost = () => {
    toast({
      title: "Editar publicação",
      description: "Funcionalidade em desenvolvimento.",
    });
    setShowOptions(false);
  };

  const handleDeletePost = () => {
    toast({
      title: "Excluir publicação",
      description: "Funcionalidade em desenvolvimento.",
    });
    setShowOptions(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {/* Post header with user info */}
        <div className="flex justify-between items-start mb-4">
          <div 
            className={`flex items-center space-x-3 ${userRole === 'client' ? 'cursor-pointer' : ''}`}
            onClick={userRole === 'client' ? handleProfessionalClick : undefined}
          >
            <Avatar>
              <AvatarImage src={post.professionalImage} alt={post.professionalName} />
              <AvatarFallback>{post.professionalName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.professionalName}</p>
              <p className="text-xs text-muted-foreground">{formattedDate()}</p>
            </div>
          </div>

          {userRole === 'professional' && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePostOptions}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical">
                  <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                </svg>
              </Button>
              
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 border">
                  <div className="py-1">
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={handleEditPost}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar publicação
                    </button>
                    <button 
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleDeletePost}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir publicação
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Post content */}
        <p className="mb-4">{post.content}</p>
        
        {/* Post image */}
        {post.image && (
          <div className="relative rounded-md overflow-hidden mb-4">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        )}
        
        {/* Post stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div>
            <span>{likeCount} curtidas</span>
          </div>
          <div>
            <span>{post.comments} comentários</span>
          </div>
        </div>
      </CardContent>
      
      {/* Post actions */}
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className={liked ? "text-red-500" : ""}
        >
          <Heart className={`h-5 w-5 mr-1 ${liked ? "fill-current text-red-500" : ""}`} />
          Curtir
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onCommentClick || (() => setIsCommentsOpen(true))}
        >
          <MessageSquare className="h-5 w-5 mr-1" />
          Comentar
        </Button>
        
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="h-5 w-5 mr-1" />
          Compartilhar
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onSave}
          className={isSaved ? "text-yellow-500" : ""}
        >
          <Bookmark className={`h-5 w-5 mr-1 ${isSaved ? "fill-current text-yellow-500" : ""}`} />
          Salvar
        </Button>
      </CardFooter>

      {/* Comments dialog */}
      <CustomDialog
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        title="Comentários"
        description="Veja e responda aos comentários da sua publicação."
      >
        <CommentSection 
          postId={post.id} 
          initialComments={[]} 
          onClose={() => setIsCommentsOpen(false)}
        />
      </CustomDialog>
    </Card>
  );
}

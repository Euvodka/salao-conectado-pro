
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Heart, MessageCircle, Share2, Briefcase } from "lucide-react";
import { Post } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post;
  userRole: 'client' | 'professional';
  onSave?: (post: Post) => void;
}

export function PostCard({ post, userRole, onSave }: PostCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [following, setFollowing] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{id: string, text: string, username: string}>>([]);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setSaved(!saved);
    
    if (!saved && onSave) {
      onSave(post);
      toast({
        title: "Post salvo",
        description: "Este post foi adicionado aos seus salvos",
      });
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
    toast({
      title: following ? "Deixou de seguir" : "Agora você segue",
      description: following 
        ? `Você deixou de seguir ${post.professionalName}` 
        : `Você agora segue ${post.professionalName}`,
    });
  };

  const navigateToProfile = () => {
    navigate(`/professionals/${post.professionalId}`);
  };

  const handleCommentClick = () => {
    setIsCommenting(true);
    setShowComments(true);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 0);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim()) {
      const newComment = {
        id: `comment-${Date.now()}`,
        text: commentText,
        username: "Você"
      };
      
      setComments(prev => [...prev, newComment]);
      setCommentText("");
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso",
      });
    }
  };

  const handleViewServices = () => {
    navigate(`/professionals/${post.professionalId}?tab=services`);
  };

  return (
    <Card className="mb-4 border-gray-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center space-x-3">
          <div onClick={navigateToProfile} className="cursor-pointer">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={post.professionalImage} alt={post.professionalName} />
              <AvatarFallback className="bg-salon-200 text-salon-700">
                {post.professionalName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div 
              onClick={navigateToProfile}
              className="font-medium hover:underline cursor-pointer text-salon-800"
            >
              {post.professionalName}
            </div>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
          {userRole === 'client' && (
            <Button 
              variant="outline"
              size="sm"
              className={`text-xs font-medium ${
                following 
                  ? 'bg-salon-50 border-salon-500 text-salon-600 hover:bg-salon-100' 
                  : 'border-salon-500 text-salon-600 hover:bg-salon-50 hover:text-salon-700'
              }`}
              onClick={handleFollow}
            >
              {following ? 'Seguindo' : 'Seguir'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm mb-3">{post.content}</p>
        <div className="rounded-md overflow-hidden">
          <img 
            src={post.image} 
            alt="Post" 
            className="w-full h-auto object-cover cursor-pointer"
            onClick={navigateToProfile}
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex-col">
        <div className="flex justify-between w-full">
          <div className="flex items-center space-x-5">
            <button 
              className="flex items-center space-x-1 group"
              onClick={handleLike}
            >
              <Heart 
                size={20} 
                className={`${liked ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} 
              />
              <span className={`text-sm ${liked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>
                {likeCount}
              </span>
            </button>
            <button 
              className="flex items-center space-x-1 text-gray-500 hover:text-salon-600"
              onClick={handleCommentClick}
            >
              <MessageCircle size={20} />
              <span className="text-sm">{comments.length + post.comments}</span>
            </button>
            <button 
              className="text-gray-500 hover:text-salon-600 flex items-center space-x-1"
              onClick={handleViewServices}
            >
              <Briefcase size={20} />
              <span className="text-sm">Serviços</span>
            </button>
          </div>
          <button 
            className="text-gray-500 hover:text-salon-600"
            onClick={handleSave}
          >
            <Bookmark 
              size={20} 
              className={saved ? 'fill-salon-500 text-salon-500' : ''} 
            />
          </button>
        </div>

        {showComments && (
          <div className="w-full mt-3 pt-3 border-t">
            {comments.length > 0 && (
              <div className="mb-3 space-y-2">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-xl p-2 text-sm flex-grow">
                      <p className="font-medium text-xs">{comment.username}</p>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={submitComment} className="flex items-center gap-2">
              <Input
                placeholder="Adicione um comentário..."
                className="flex-grow"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                ref={commentInputRef}
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!commentText.trim()}
              >
                Enviar
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

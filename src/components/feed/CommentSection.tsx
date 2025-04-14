
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

type Comment = {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
};

type CommentSectionProps = {
  postId: string;
  initialComments?: Comment[];
  onClose?: () => void;
};

export function CommentSection({ postId, initialComments = [], onClose }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: user?.name || "Você",
        avatar: user?.profileImage,
      },
      content: newComment.trim(),
      createdAt: "Agora",
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado com sucesso!",
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Comentários</h3>
      
      {comments.length > 0 ? (
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium text-sm">{comment.author.name}</p>
                  <p className="text-sm">{comment.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{comment.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Seja o primeiro a comentar!</p>
      )}
      
      <div className="flex space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profileImage} alt={user?.name} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex space-x-2">
          <Input
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newComment.trim()) {
                e.preventDefault();
                addComment();
              }
            }}
          />
          <Button onClick={addComment} disabled={!newComment.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {onClose && (
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      )}
    </div>
  );
}

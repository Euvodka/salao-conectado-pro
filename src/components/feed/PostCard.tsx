
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  userRole: 'client' | 'professional';
}

export function PostCard({ post, userRole }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <Card className="mb-4 border-gray-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center space-x-3">
          <Link to={`/professional/${post.professionalId}`}>
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={post.professionalImage} alt={post.professionalName} />
              <AvatarFallback className="bg-salon-200 text-salon-700">
                {post.professionalName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link 
              to={`/professional/${post.professionalId}`}
              className="font-medium hover:underline text-salon-800"
            >
              {post.professionalName}
            </Link>
            <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
          {userRole === 'client' && (
            <Button 
              variant="outline"
              size="sm"
              className="text-xs font-medium border-salon-500 text-salon-600 hover:bg-salon-50 hover:text-salon-700"
            >
              Seguir
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
            className="w-full h-auto object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
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
          <button className="flex items-center space-x-1 text-gray-500 hover:text-salon-600">
            <MessageCircle size={20} />
            <span className="text-sm">{post.comments}</span>
          </button>
          <button className="text-gray-500 hover:text-salon-600">
            <Share2 size={20} />
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
      </CardFooter>
    </Card>
  );
}

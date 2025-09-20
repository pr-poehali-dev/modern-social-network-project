import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { User, Post } from '@/types';
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src={post.user?.avatar_url} />
            <AvatarFallback>{post.user?.display_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold">{post.user?.display_name}</h4>
              {post.user?.is_verified && (
                <Icon name="BadgeCheck" size={16} className="text-primary" />
              )}
              <span className="text-sm text-gray-500">@{post.user?.username}</span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
            </div>
            
            <p className="text-gray-900 mb-3">{post.content}</p>
            
            {post.image_url && (
              <div className="mb-4">
                <img 
                  src={post.image_url} 
                  alt="Post content" 
                  className="w-full rounded-lg max-h-96 object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onLike(post.id)}
                className="text-gray-500 hover:text-red-500"
              >
                <Icon name="Heart" size={16} className="mr-1" />
                {post.likes_count}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                <Icon name="MessageCircle" size={16} className="mr-1" />
                {post.comments_count}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                <Icon name="Repeat2" size={16} className="mr-1" />
                Поделиться
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Icon name="Bookmark" size={16} className="mr-1" />
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
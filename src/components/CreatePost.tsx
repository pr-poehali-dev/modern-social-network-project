import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_verified: boolean;
}

interface CreatePostProps {
  currentUser: User | null;
  onCreatePost: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onCreatePost }) => {
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    onCreatePost(newPost);
    setNewPost('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src={currentUser?.avatar_url} />
            <AvatarFallback>{currentUser?.display_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Что у вас нового?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] border-0 resize-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Image" size={16} className="mr-1" />
                  Фото
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Video" size={16} className="mr-1" />
                  Видео
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Smile" size={16} className="mr-1" />
                  Эмодзи
                </Button>
              </div>
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                Опубликовать
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
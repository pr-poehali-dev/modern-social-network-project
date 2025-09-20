import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { User, Post } from '@/types';

interface Post {
  id: number;
  user_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user?: User;
}

interface MainContentProps {
  activeTab: string;
  currentUser: User | null;
  posts: Post[];
  onCreatePost: (content: string) => void;
  onLikePost: (postId: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  activeTab, 
  currentUser, 
  posts, 
  onCreatePost, 
  onLikePost 
}) => {
  if (activeTab === 'feed') {
    return (
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
          
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={onLikePost} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'messages') {
    return (
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Сообщения</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Icon name="MessageCircle" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ваши сообщения</h3>
              <p className="text-gray-500">Здесь будут отображаться ваши личные сообщения</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Профиль</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={currentUser?.avatar_url} />
                <AvatarFallback className="text-2xl">{currentUser?.display_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold">{currentUser?.display_name}</h2>
                {currentUser?.is_verified && (
                  <Icon name="BadgeCheck" size={20} className="text-primary" />
                )}
              </div>
              <p className="text-gray-500 mb-4">@{currentUser?.username}</p>
              <p className="text-gray-700 mb-6">{currentUser?.bio || 'Пользователь еще не добавил описание'}</p>
              
              <div className="grid grid-cols-3 gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentUser?.posts_count}</div>
                  <div className="text-gray-500">Постов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentUser?.followers_count}</div>
                  <div className="text-gray-500">Подписчиков</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentUser?.following_count}</div>
                  <div className="text-gray-500">Подписок</div>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90">
                Редактировать профиль
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Уведомления</h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Icon name="Bell" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомления</h3>
              <p className="text-gray-500">Здесь будут отображаться ваши уведомления</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default MainContent;
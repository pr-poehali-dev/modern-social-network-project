import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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

interface SidebarProps {
  currentUser: User | null;
  users: User[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, users }) => {
  return (
    <div className="lg:col-span-1">
      <div className="space-y-4">
        {/* User Profile Card */}
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentUser?.avatar_url} />
                <AvatarFallback>{currentUser?.display_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="font-semibold">{currentUser?.display_name}</h3>
                  {currentUser?.is_verified && (
                    <Icon name="BadgeCheck" size={16} className="text-primary" />
                  )}
                </div>
                <p className="text-sm text-gray-500">@{currentUser?.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{currentUser?.posts_count}</div>
                <div className="text-xs text-gray-500">Постов</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{currentUser?.followers_count}</div>
                <div className="text-xs text-gray-500">Подписчиков</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{currentUser?.following_count}</div>
                <div className="text-xs text-gray-500">Подписок</div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Быстрые действия</h4>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Icon name="Camera" size={16} className="mr-2" />
                  Создать Story
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Icon name="Video" size={16} className="mr-2" />
                  Прямой эфир
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Icon name="Users" size={16} className="mr-2" />
                  Найти друзей
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Users */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Рекомендации</h3>
            <div className="space-y-4">
              {users.filter(user => user.id !== currentUser?.id).slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.display_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-1">
                        <p className="font-medium text-sm">{user.display_name}</p>
                        {user.is_verified && (
                          <Icon name="BadgeCheck" size={12} className="text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Подписаться
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">В тренде</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="font-medium">#photography</p>
                <p className="text-sm text-gray-500">15.2K постов</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">#react</p>
                <p className="text-sm text-gray-500">8.7K постов</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">#art</p>
                <p className="text-sm text-gray-500">23.1K постов</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">#travel</p>
                <p className="text-sm text-gray-500">12.3K постов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
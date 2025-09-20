import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { User } from '@/types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, activeTab, setActiveTab, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Users" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-primary">SocialNet</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Button 
              variant={activeTab === 'feed' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('feed')}
              className="flex items-center space-x-2"
            >
              <Icon name="Home" size={20} />
              <span>Лента</span>
            </Button>
            <Button 
              variant={activeTab === 'messages' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('messages')}
              className="flex items-center space-x-2"
            >
              <Icon name="MessageCircle" size={20} />
              <span>Сообщения</span>
            </Button>
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2"
            >
              <Icon name="User" size={20} />
              <span>Профиль</span>
            </Button>
            <Button 
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('notifications')}
              className="flex items-center space-x-2"
            >
              <Icon name="Bell" size={20} />
              <span>Уведомления</span>
            </Button>
          </nav>

          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatar_url} />
              <AvatarFallback>{currentUser?.display_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              onClick={onLogout}
              size="sm"
            >
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
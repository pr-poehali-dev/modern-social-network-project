-- Создание таблиц для социальной сети

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT '',
    avatar_url VARCHAR(500) DEFAULT '',
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица постов
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    image_url VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица лайков
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Таблица комментариев
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица подписок
CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id),
    following_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица историй (Stories)
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    content TEXT,
    image_url VARCHAR(500),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '24 hours',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Добавляем тестовых пользователей
INSERT INTO users (username, email, password_hash, display_name, bio, avatar_url, followers_count, following_count, posts_count, is_verified) VALUES
('maria_smile', 'maria@example.com', 'hash123', 'Мария Иванова', 'Фотограф и путешественница 📸✈️', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', 1234, 456, 89, true),
('alex_dev', 'alex@example.com', 'hash456', 'Алексей Петров', 'Frontend разработчик | React | TypeScript', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 2341, 234, 156, false),
('natasha_art', 'natasha@example.com', 'hash789', 'Наташа Сидорова', 'Художник и дизайнер 🎨', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natasha', 987, 567, 203, true);

-- Добавляем тестовые посты
INSERT INTO posts (user_id, content, image_url, likes_count, comments_count) VALUES
(1, 'Прекрасный закат в Санкт-Петербурге! 🌅 #photography #sunset', 'https://picsum.photos/600/400?random=1', 234, 12),
(2, 'Новый проект на React готов! 🚀 Делитесь мнением', 'https://picsum.photos/600/400?random=2', 89, 5),
(3, 'Работа над новой картиной в процессе 🎨', 'https://picsum.photos/600/400?random=3', 156, 8),
(1, 'Доброе утро! Как дела? ☀️', NULL, 45, 3),
(2, 'TypeScript спасает мир разработки! ⚡', NULL, 67, 7);

-- Добавляем тестовые лайки
INSERT INTO likes (user_id, post_id) VALUES
(2, 1), (3, 1), (1, 2), (3, 2), (1, 3), (2, 3);

-- Добавляем тестовые комментарии
INSERT INTO comments (user_id, post_id, content) VALUES
(2, 1, 'Потрясающий кадр! 👏'),
(3, 1, 'Какая красота!'),
(1, 2, 'Круто получилось! 🔥'),
(3, 2, 'Жду релиз!'),
(2, 3, 'Талант! 🎨');

-- Добавляем тестовые подписки
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2);
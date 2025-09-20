import json
import os
import psycopg2
from typing import Dict, Any, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с постами в социальной сети
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с постами или результатом операции
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS OPTIONS запроса
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        # Подключение к базе данных
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Database URL not configured'})
            }
        
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if method == 'GET':
            # Получение ленты постов
            params = event.get('queryStringParameters', {}) or {}
            limit = int(params.get('limit', 20))
            offset = int(params.get('offset', 0))
            
            cur.execute("""
                SELECT p.id, p.user_id, p.content, p.image_url, p.likes_count, 
                       p.comments_count, p.created_at,
                       u.username, u.display_name, u.avatar_url, u.is_verified
                FROM posts p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC
                LIMIT %s OFFSET %s
            """, (limit, offset))
            
            posts = cur.fetchall()
            
            posts_data = []
            for post in posts:
                posts_data.append({
                    'id': post[0],
                    'user_id': post[1],
                    'content': post[2],
                    'image_url': post[3],
                    'likes_count': post[4],
                    'comments_count': post[5],
                    'created_at': post[6].isoformat() if post[6] else None,
                    'user': {
                        'username': post[7],
                        'display_name': post[8],
                        'avatar_url': post[9],
                        'is_verified': post[10]
                    }
                })
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'posts': posts_data,
                    'total': len(posts_data)
                })
            }
        
        elif method == 'POST':
            # Создание нового поста
            body_data = json.loads(event.get('body', '{}'))
            
            user_id = body_data.get('user_id')
            content = body_data.get('content', '').strip()
            image_url = body_data.get('image_url')
            
            if not user_id or not content:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'User ID and content are required'})
                }
            
            # Создание поста
            cur.execute("""
                INSERT INTO posts (user_id, content, image_url)
                VALUES (%s, %s, %s)
                RETURNING id, user_id, content, image_url, likes_count, 
                          comments_count, created_at
            """, (user_id, content, image_url))
            
            post = cur.fetchone()
            
            # Обновляем счетчик постов пользователя
            cur.execute("""
                UPDATE users SET posts_count = posts_count + 1 
                WHERE id = %s
            """, (user_id,))
            
            conn.commit()
            
            # Получаем данные пользователя
            cur.execute("""
                SELECT username, display_name, avatar_url, is_verified
                FROM users WHERE id = %s
            """, (user_id,))
            
            user = cur.fetchone()
            
            post_data = {
                'id': post[0],
                'user_id': post[1],
                'content': post[2],
                'image_url': post[3],
                'likes_count': post[4],
                'comments_count': post[5],
                'created_at': post[6].isoformat() if post[6] else None,
                'user': {
                    'username': user[0],
                    'display_name': user[1],
                    'avatar_url': user[2],
                    'is_verified': user[3]
                }
            }
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'post': post_data
                })
            }
        
        elif method == 'PUT':
            # Лайк поста
            body_data = json.loads(event.get('body', '{}'))
            
            post_id = body_data.get('post_id')
            user_id = body_data.get('user_id')
            action = body_data.get('action', 'like')  # like или unlike
            
            if not post_id or not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Post ID and User ID are required'})
                }
            
            if action == 'like':
                # Проверяем, не лайкнул ли уже
                cur.execute("SELECT id FROM likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Already liked'})
                    }
                
                # Добавляем лайк
                cur.execute("INSERT INTO likes (user_id, post_id) VALUES (%s, %s)", (user_id, post_id))
                
                # Обновляем счетчик лайков
                cur.execute("UPDATE posts SET likes_count = likes_count + 1 WHERE id = %s", (post_id,))
                
            elif action == 'unlike':
                # Удаляем лайк
                cur.execute("DELETE FROM likes WHERE user_id = %s AND post_id = %s", (user_id, post_id))
                
                # Обновляем счетчик лайков
                cur.execute("UPDATE posts SET likes_count = likes_count - 1 WHERE id = %s", (post_id,))
            
            conn.commit()
            
            # Получаем обновленный счетчик лайков
            cur.execute("SELECT likes_count FROM posts WHERE id = %s", (post_id,))
            likes_count = cur.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({
                    'success': True,
                    'likes_count': likes_count
                })
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
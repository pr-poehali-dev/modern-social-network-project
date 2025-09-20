import json
import hashlib
import os
import psycopg2
from typing import Dict, Any, Optional

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Система авторизации для социальной сети
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с токеном или ошибкой
    """
    method: str = event.get('httpMethod', 'GET')
    
    # Обработка CORS OPTIONS запроса
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'login':
                username = body_data.get('username', '').strip()
                password = body_data.get('password', '').strip()
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'Username and password required'})
                    }
                
                # Простая проверка пароля (в продакшне нужен bcrypt)
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                # Поиск пользователя
                cur.execute("""
                    SELECT id, username, email, display_name, bio, avatar_url, 
                           followers_count, following_count, posts_count, is_verified
                    FROM users 
                    WHERE username = %s AND password_hash = %s
                """, (username, password_hash))
                
                user = cur.fetchone()
                
                if user:
                    user_data = {
                        'id': user[0],
                        'username': user[1],
                        'email': user[2],
                        'display_name': user[3],
                        'bio': user[4],
                        'avatar_url': user[5],
                        'followers_count': user[6],
                        'following_count': user[7],
                        'posts_count': user[8],
                        'is_verified': user[9]
                    }
                    
                    # Генерация простого токена (в продакшне нужен JWT)
                    token = hashlib.md5(f"{user[0]}_{context.request_id}".encode()).hexdigest()
                    
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({
                            'success': True,
                            'token': token,
                            'user': user_data
                        })
                    }
                else:
                    return {
                        'statusCode': 401,
                        'headers': headers,
                        'body': json.dumps({'error': 'Invalid credentials'})
                    }
            
            elif action == 'register':
                username = body_data.get('username', '').strip()
                email = body_data.get('email', '').strip()
                password = body_data.get('password', '').strip()
                display_name = body_data.get('display_name', '').strip()
                
                if not all([username, email, password, display_name]):
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': 'All fields are required'})
                    }
                
                # Проверка существования пользователя
                cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
                if cur.fetchone():
                    return {
                        'statusCode': 409,
                        'headers': headers,
                        'body': json.dumps({'error': 'User already exists'})
                    }
                
                # Хеширование пароля
                password_hash = hashlib.sha256(password.encode()).hexdigest()
                
                # Создание пользователя
                avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
                
                cur.execute("""
                    INSERT INTO users (username, email, password_hash, display_name, avatar_url)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, username, email, display_name, bio, avatar_url,
                              followers_count, following_count, posts_count, is_verified
                """, (username, email, password_hash, display_name, avatar_url))
                
                user = cur.fetchone()
                conn.commit()
                
                user_data = {
                    'id': user[0],
                    'username': user[1],
                    'email': user[2],
                    'display_name': user[3],
                    'bio': user[4],
                    'avatar_url': user[5],
                    'followers_count': user[6],
                    'following_count': user[7],
                    'posts_count': user[8],
                    'is_verified': user[9]
                }
                
                # Генерация токена
                token = hashlib.md5(f"{user[0]}_{context.request_id}".encode()).hexdigest()
                
                return {
                    'statusCode': 201,
                    'headers': headers,
                    'body': json.dumps({
                        'success': True,
                        'token': token,
                        'user': user_data
                    })
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
        elif method == 'GET':
            # Проверка токена (базовая версия)
            token = event.get('queryStringParameters', {}).get('token')
            if not token:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Token required'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'valid': True})
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
import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const TYPE_LABELS = {
  TIP: 'Dica',
  NEWS: 'Notícia',
  RESULT: 'Resultado',
  POST: 'Publicação',
};

const TYPE_COLORS = {
  TIP: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  NEWS: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  RESULT: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  POST: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function FeedPost({ post, onDelete, onLikeToggle }) {
  const { user } = useAuth();
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!user || liking) return;
    setLiking(true);
    try {
      await axios.post(`${API_URL}/feed/${post.id}/like`);
      onLikeToggle?.(post.id);
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta publicação?')) return;
    try {
      await axios.delete(`${API_URL}/feed/${post.id}`);
      onDelete?.(post.id);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const isOwner = user && post.authorId === user.id;

  return (
    <article className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary dark:bg-primary-light text-white font-bold flex items-center justify-center text-xs">
            {post.authorName?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
              {post.authorName || 'Mustang'}
            </p>
            <p className="text-xs text-gray-500 dark:text-dark-text-secondary">
              {new Date(post.timestamp).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[post.type] || TYPE_COLORS.POST}`}>
          {TYPE_LABELS[post.type] || post.type}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">{post.title}</h3>
      <p className="text-sm text-gray-700 dark:text-dark-text-secondary whitespace-pre-line">{post.content}</p>

      {post.media && post.media.length > 0 && (
        <div className="mt-3 rounded-lg overflow-hidden">
          {post.media.map((m) => (
            <img
              key={m.id}
              src={m.url}
              alt={m.altText || ''}
              className="w-full object-cover max-h-80"
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
        <button
          onClick={handleLike}
          disabled={!user}
          className={`flex items-center gap-1 text-sm transition-colors ${
            post.likedByCurrentUser
              ? 'text-red-500'
              : 'text-gray-500 dark:text-dark-text-secondary hover:text-red-500'
          } disabled:opacity-50`}
        >
          <svg className="w-5 h-5" fill={post.likedByCurrentUser ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {post.likeCount > 0 && <span>{post.likeCount}</span>}
        </button>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-dark-text-secondary hover:text-red-500 transition-colors ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        )}
      </div>
    </article>
  );
}

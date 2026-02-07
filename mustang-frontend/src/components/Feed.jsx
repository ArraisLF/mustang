import { useState, useEffect } from 'react';
import axios from 'axios';
import FeedPost from './FeedPost';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/feed`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar o feed. Tente novamente.');
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleLikeToggle = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByCurrentUser: !p.likedByCurrentUser,
              likeCount: p.likedByCurrentUser ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 dark:text-red-400 mb-3">{error}</p>
        <button
          onClick={fetchPosts}
          className="text-sm text-primary dark:text-accent hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-dark-text-secondary">
          Nenhuma publicação no feed ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedPost
          key={post.id}
          post={post}
          onDelete={handleDelete}
          onLikeToggle={handleLikeToggle}
        />
      ))}
    </div>
  );
}

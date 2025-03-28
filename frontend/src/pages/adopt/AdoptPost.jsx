import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AdoptPost = () => {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const breedId = searchParams.get('breed');
        
        // Adjust your API endpoint accordingly
        const url = breedId 
          ? `/api/adopt-posts?breed=${breedId}`
          : '/api/adopt-posts';
          
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Render your posts here */}
      {posts.map(post => (
        <div key={post.id}>
          {/* Post content */}
        </div>
      ))}
    </div>
  );
};

export default AdoptPost; 
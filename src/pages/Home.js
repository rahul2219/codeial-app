import styles from '../styles/home.module.css';

import { Comments } from './index';
import { FriendsList, Loader, Post } from '../components';
import { Link } from 'react-router-dom';
import { useAuth, usePosts } from '../hooks';
import CreatePost from '../components/CreatePost';

const Home = () => {
  const auth = useAuth();
  const posts = usePosts();
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const res = await getPosts();
  //     console.log(res);
  //     if (res.success) {
  //       setPosts(res.data.posts);
  //     }
  //     setLoader(false);
  //   };
  //   fetchPosts();
  // }, []);
  if (posts.loading) {
    return <Loader />;
  }
  return (
    <div className={styles.home}>
      <div className={styles.postsList}>
        <CreatePost />
        {posts.data.map((post) => {
          return <Post post={post} key={`post-${post._id}`} />;
        })}
      </div>
      {auth.user && <FriendsList />}
    </div>
  );
};

export default Home;

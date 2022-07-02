import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { createComment, toggleLike } from '../api';
import { usePosts } from '../hooks';
import styles from '../styles/home.module.css';
import { Comment } from './';

const Post = ({ post }) => {
  const [comment, setComment] = useState('');
  const [creatingComment, setCreatingComment] = useState(false);
  const posts = usePosts();
  useEffect(() => {
    const getPostLikes = async () => {};
    getPostLikes();
  });
  const handleAddComment = async (e) => {
    if (e.key === 'Enter') {
      setCreatingComment(true);

      const response = await createComment(comment, post._id);

      if (response.success) {
        setComment('');
        posts.addComment(response.data.comment, post._id);
        toast.success('Comment created successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        toast.error(response.message, {
          duration: 3000,
          position: 'top-center',
        });
      }

      setCreatingComment(false);
    }
  };
  const handlePostLikeClick = async () => {
    const response = await toggleLike(post._id, 'Post');
    if (response.success) {
      if (!response.data.deleted) {
        toast.success('Liked post successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      } else {
        toast.success('Removed like from post successfully!', {
          duration: 3000,
          position: 'top-center',
        });
      }
    } else {
      toast.error(response.message, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };
  return (
    <div className={styles.postWrapper} key={post._id}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>
          <img
            src='https://cdn-icons-png.flaticon.com/128/1077/1077012.png'
            alt='user-pic'
          />
          <div>
            <Link
              to={{
                pathname: `/user/${post.user._id}`,
                state: {
                  user: post.user,
                },
              }}
              className={styles.postAuthor}
            >
              {post.user.name}
            </Link>
            <span className={styles.postTime}>a minute ago</span>
          </div>
        </div>
        <div className={styles.postContent}>{post.content}</div>

        <div className={styles.postActions}>
          <div className={styles.postLike}>
            <button onClick={handlePostLikeClick} className={styles.likeButton}>
              <img
                src='https://cdn-icons-png.flaticon.com/512/889/889140.png'
                alt='likes-icon'
              />
            </button>
            <span>{post.likes.length}</span>
          </div>

          <div className={styles.postCommentsIcon}>
            <img
              src='https://cdn-icons-png.flaticon.com/512/1380/1380338.png'
              alt='comments-icon'
            />
            <span>{post.comments.length}</span>
          </div>
        </div>
        <div className={styles.postCommentBox}>
          <input
            placeholder='Start typing a comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleAddComment}
          />
        </div>

        <div className={styles.postCommentsList}>
          {post.comments.map((comment) => (
            <Comment comment={comment} key={`post-comment-${comment._id}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

export default Post;

import styles from '../styles/comments.module.css';
const Comments = ({ comments }) => {
  return (
    <>
      {comments.map((comment) => {
        return (
          <div className={styles.postCommentsList} key={comment._id}>
            <div className={styles.postCommentsItem}>
              <div className={styles.postCommentHeader}>
                <span className={styles.postCommentAuthor}>
                  {comment.user.name}
                </span>
                <span className={styles.postCommentTime}>a minute ago</span>
                <span className={styles.postCommentLikes}>
                  {comment.likes.length}
                </span>
              </div>

              <div className={styles.postCommentContent}>{comment.content}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Comments;

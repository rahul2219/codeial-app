import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { addFriend, fetchUserProfile, removeFriend } from '../api';
import styles from '../styles/settings.module.css';
import { Loader } from '../components';
import { useAuth } from '../hooks/index';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await fetchUserProfile(userId);
      if (response.success) {
        setUser(response.data.user);
        setLoading(false);
      } else {
        setLoading(false);
        navigate('/');
        toast.error('User not found!!', {
          duration: 5000,
          position: 'top-center',
        });
      }
    };
    getUserInfo();
  }, [userId, navigate]);

  const checkIfUserIsFriend = () => {
    const friends = auth.user.friends;
    if (friends) {
      const friendIds = friends.map((friend) => friend.to_user._id);
      const index = friendIds.indexOf(userId);
      if (index !== -1) {
        return true;
      }
    }
    return false;
  };
  const handleRemoveFriend = async () => {
    setRequestInProgress(true);
    const response = await removeFriend(userId);
    console.log(response);
    if (response.success) {
      const friendship = auth.user.friends.filter(
        (friend) => friend.to_user._id === userId
      );
      auth.updateUserFriends(false, friendship[0]);
      toast.success('Friend removed successfully', {
        duration: 5000,
        position: 'top-center',
      });
    } else {
      toast.error(response.message, {
        duration: 5000,
        position: 'top-center',
      });
    }
    setRequestInProgress(true);
  };

  const handleAddFriend = async () => {
    setRequestInProgress(true);
    const response = await addFriend(userId);
    if (response.success) {
      const { friendship } = response.data;
      auth.updateUserFriends(true, friendship);
      toast.success('Friend added successfully', {
        duration: 5000,
        position: 'top-center',
      });
    } else {
      toast.error(response.message, {
        duration: 5000,
        position: 'top-center',
      });
    }
    setRequestInProgress(true);
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.settings}>
      <div className={styles.imgContainer}>
        <img
          src='https://cdn-icons-png.flaticon.com/128/1077/1077012.png'
          alt=''
        />
      </div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>Email</div>
        <div className={styles.fieldValue}>{user?.email}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>Name</div>
        <div className={styles.fieldValue}>{user?.name}</div>
      </div>
      <div className='btnGrp'>
        {checkIfUserIsFriend() ? (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleRemoveFriend}
          >
            {requestInProgress ? 'Removing Friend' : 'Remove Friend'}
          </button>
        ) : (
          <button
            className={`button ${styles.saveBtn}`}
            onClick={handleAddFriend}
          >
            {requestInProgress ? 'Adding Friend' : 'Add Friend'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

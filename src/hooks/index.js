import { useContext, useEffect, useState } from 'react';
import jwt from 'jwt-decode';
import { AuthContext, PostsContext } from '../providers/index';
import {
  editProfile,
  fetchUserFriends,
  getPosts,
  login as userLogin,
  register,
} from '../api/index';
import {
  setItemInLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  removeItemFromLocalStorage,
  getItemFromLocalStorage,
} from '../utils';

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenChanged, setTokenChanged] = useState(false);
  useEffect(() => {
    const getUser = async () => {
      console.log('useEff');
      const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
      // console.log(userToken);
      if (userToken) {
        const user = jwt(userToken);
        const response = await fetchUserFriends();
        console.log('res', response);
        let friends = [];
        if (response.success) {
          friends = response.data.friends;
        }
        setUser({ ...user, friends: friends });
      }
      setLoading(false);
    };
    getUser();
  }, [tokenChanged]);
  const login = async (email, password) => {
    setLoading(true);
    const response = await userLogin(email, password);
    if (response.success) {
      console.log('response');
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      setTokenChanged(true);
      setLoading(false);
      return {
        success: true,
      };
    } else {
      setLoading(false);
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const logout = () => {
    setUser(null);
    setTokenChanged(false);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
  };
  const signup = async (name, email, password, confirmPassword) => {
    const response = await register(name, email, password, confirmPassword);
    console.log(name, email, password, confirmPassword);
    if (response.success) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const updateUser = async (userId, name, password, confirmPassword) => {
    const response = await editProfile(userId, name, password, confirmPassword);
    if (response.success) {
      console.log(response.data.token);
      setUser(response.data.user);
      setItemInLocalStorage(
        LOCALSTORAGE_TOKEN_KEY,
        response.data.token ? response.data.token : null
      );
      setTokenChanged(true);
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  };
  const updateUserFriends = (addFriend, friend) => {
    if (addFriend) {
      setUser({
        ...user,
        friends: [...user.friends, friend],
      });
      return;
    }
    const newFriends = user.friends.filter(
      (f) => f.to_user._id !== friend.to_user._id
    );
    setUser({
      ...user,
      friends: newFriends,
    });
  };
  return {
    user,
    login,
    logout,
    signup,
    loading,
    updateUser,
    updateUserFriends,
  };
};

export const usePosts = () => {
  return useContext(PostsContext);
};

export const useProvidePosts = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getPosts();

      if (response.success) {
        setPosts(response.data.posts);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  const addPostToState = (post) => {
    const newPosts = [post, ...posts];

    setPosts(newPosts);
  };

  const addComment = (comment, postId) => {
    const newPosts = posts.map((post) => {
      if (post._id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });

    setPosts(newPosts);
  };
  return {
    data: posts,
    loading,
    addPostToState,
    addComment,
  };
};

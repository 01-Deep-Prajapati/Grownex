import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { UserCircleIcon, PhotoIcon, VideoCameraIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Post from '../components/Post';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Uploading...</span>
    </div>
);

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchPosts();
        fetchUserProfile();
    }, [user, navigate]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    const handlePostUpdate = (updatedPost) => {
        setPosts(posts.map(post =>
            post._id === updatedPost._id ? updatedPost : post
        ));
    };

    const handlePostDelete = (deletedPostId) => {
        setPosts(posts.filter(post => post._id !== deletedPostId));
    };

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    const handleMediaSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setError('');
            if (file.size > MAX_FILE_SIZE) {
                setError(`File size too large. Maximum size is 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                fileInputRef.current.value = '';
                return;
            }
            setSelectedMedia(file);
            setSelectedFileName(file.name);
            // Clear any previous preview URL to avoid memory leaks
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
            }
            setMediaPreview(null);
        }
    };

    const handleRemoveMedia = () => {
        setSelectedMedia(null);
        setSelectedFileName('');
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
            setMediaPreview(null);
        }
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('content', newPost);
            if (selectedMedia) {
                formData.append('media', selectedMedia);
            }

            const token = localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/posts`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setNewPost('');
            setSelectedMedia(null);
            setSelectedFileName('');
            if (mediaPreview) {
                URL.revokeObjectURL(mediaPreview);
                setMediaPreview(null);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
            setError('Failed to create post. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

            <main className="max-w-2xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <form onSubmit={handleCreatePost} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <div className="mb-4">
                        <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none text-gray-600 resize-none"
                            rows="3"
                            required
                        />
                    </div>

                    {selectedFileName && (
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 mb-4">
                            <div className="flex items-center space-x-2">
                                {selectedMedia?.type.startsWith('image/') ? (
                                    <PhotoIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <VideoCameraIcon className="h-5 w-5 text-gray-500" />
                                )}
                                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                    {selectedFileName}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveMedia}
                                className="text-red-500 hover:text-red-600 transition-colors duration-200"
                            >
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleMediaSelect}
                                    accept="image/*,video/*"
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError('');
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isUploading}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PhotoIcon className="h-5 w-5" />
                                    <span>Photo</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError('');
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isUploading}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <VideoCameraIcon className="h-5 w-5" />
                                    <span>Video</span>
                                </button>
                                <span className="text-xs text-gray-500">(Max size: 5MB)</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {isUploading && <LoadingSpinner />}
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isUploading ? 'Sharing...' : 'Share Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <Post
                            key={post._id}
                            post={post}
                            onPostUpdate={handlePostUpdate}
                            onPostDelete={handlePostDelete}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Feed;
import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Post = ({ post, userProfile, onPostUpdate, onPostDelete }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const [showOptions, setShowOptions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [error, setError] = useState('');

    const isLiked = post.likes?.includes(user?.user?._id);

    const isOwnPost = post.userId._id === user?.user?._id;

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('content', editedContent);
            if (selectedMedia) {
                formData.append('media', selectedMedia);
            }

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                window.location.href = '/';
                return;
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/posts/${post._id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onPostUpdate(response.data);
            setIsEditing(false);
            setSelectedMedia(null);
        } catch (error) {
            setError('Failed to update post');
            console.error('Error updating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                window.location.href = '/';
                return;
            }

            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/posts/${post._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            onPostDelete(post._id);
        } catch (error) {
            setError('Failed to delete post');
            console.error('Error deleting post:', error);
        }
    };

    const handleMediaSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedMedia(file);
        }
    };

    const handleLikeToggle = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                window.location.href = '/';
                return;
            }

            const method = isLiked ? 'delete' : 'post';
            const response = await axios({
                method,
                url: `${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            onPostUpdate(response.data);
        } catch (error) {
            console.error('Error toggling like:', error);
            if (error.response?.status === 401) {
                window.location.href = '/';
            }
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    {post.userId.profileImage ? (
                        <img
                            src={post.userId.profileImage}
                            alt={post.userId.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {post.userId.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{post.userId.name}</p>
                            <p className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                        {isOwnPost && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowOptions(!showOptions)}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <EllipsisHorizontalIcon className="h-6 w-6 text-gray-500" />
                                </button>
                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setShowOptions(false);
                                            }}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-2" />
                                            Edit Post
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete();
                                                setShowOptions(false);
                                            }}
                                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-2" />
                                            Delete Post
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="mt-2">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 outline-none resize-none"
                                rows="3"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                        {selectedMedia ? 'Change Media' : 'Add Media'}
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleMediaSelect}
                                        accept="image/*,video/*"
                                        className="hidden"
                                    />
                                    {selectedMedia && (
                                        <span className="text-sm text-gray-500">
                                            {selectedMedia.name}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600">{error}</p>
                            )}
                        </form>
                    ) : (
                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.content}</p>
                    )}
                    {post.media?.url && (
                        <div className="mt-3">
                            {post.media.type === 'image' ? (
                                <img
                                    src={post.media.url}
                                    alt="Post media"
                                    className="rounded-lg max-h-96 w-auto object-contain mx-auto"
                                />
                            ) : post.media.type === 'video' ? (
                                <video
                                    src={post.media.url}
                                    controls
                                    className="rounded-lg max-h-96 w-auto mx-auto"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : null}
                        </div>
                    )}

                    <div className="mt-4 flex items-center space-x-4">
                        <button
                            onClick={handleLikeToggle}
                            disabled={isLiking}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${isLiked
                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isLiked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                />
                            </svg>
                            <span className="font-medium">
                                {isLiking ? '...' : `${post.likes?.length || 0} ${post.likes?.length === 1 ? 'Like' : 'Likes'}`}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;
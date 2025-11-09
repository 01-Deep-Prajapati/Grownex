import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PencilIcon, CameraIcon } from '@heroicons/react/24/solid';
import Post from '../components/Post';

const Profile = () => {
    const { user, logout, updateUserData } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: user?.user.name || '',
        email: user?.user.email || '',
        bio: '',
        title: '',
        location: '',
        profileImage: '',
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user || !user.user || !user.user._id) {
            navigate('/');
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([fetchProfile(), fetchUserPosts()]);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handlePostUpdate = (updatedPost) => {
        setUserPosts(userPosts.map(post =>
            post._id === updatedPost._id ? updatedPost : post
        ));
    };

    const handlePostDelete = (deletedPostId) => {
        setUserPosts(userPosts.filter(post => post._id !== deletedPostId));
    };

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            // Use _id instead of id
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/user/${user?.user?._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserPosts(response.data);
        } catch (error) {
            console.error('Error fetching user posts:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(prev => ({
                ...prev,
                ...response.data,
            }));
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/profile`,
                profile,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsEditing(false);
            setProfile(prev => ({
                ...prev,
                ...response.data
            }));
            // Update the auth context with the new profile data
            updateUserData(response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/profile/image`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setProfile(prev => ({
                ...prev,
                profileImage: response.data.profileImage
            }));
            // Update the auth context with the new profile image
            updateUserData({ profileImage: response.data.profileImage });
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-4xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center space-x-6">
                            <div className="relative group">
                                {profile.profileImage ? (
                                    <img
                                        src={profile.profileImage}
                                        alt={profile.name}
                                        className="w-24 h-24 rounded-full object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <CameraIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                                {profile.title && <p className="text-lg text-gray-600 mt-1">{profile.title}</p>}
                                {profile.location && <p className="text-gray-500 mt-1">{profile.location}</p>}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                        >
                            <PencilIcon className="h-4 w-4" />
                            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={profile.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Software Engineer"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={profile.location}
                                    onChange={handleChange}
                                    placeholder="e.g. New York, NY"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-500/30"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="prose prose-blue max-w-none">
                                <div className="bg-gray-50/50 rounded-xl p-6 mb-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                                    <p className="text-gray-600 whitespace-pre-wrap">
                                        {profile.bio || "No bio yet..."}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Posts</h2>
                                {loading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : userPosts.length > 0 ? (
                                    <div className="space-y-4">
                                        {userPosts.map(post => (
                                            <Post
                                                key={post._id}
                                                post={post}
                                                userProfile={profile}
                                                onPostUpdate={handlePostUpdate}
                                                onPostDelete={handlePostDelete}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50/50 rounded-xl">
                                        <p className="text-gray-500">No posts yet</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';


interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  taskGoal: number;
  emailNotifications: boolean;
  darkMode: boolean;
}

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    taskGoal: 5,
    emailNotifications: true,
    darkMode: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfile(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user, isLoading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsSaving(false);
    alert('Profile updated successfully!');
  };

  // const handleLogout = () => {
  //   logout();
  //   router.push('/login');
  // };

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      {/* <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>TaskManager</h1>
              <nav style={{ display: 'flex', gap: '20px' }}>
                <a href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Dashboard</a>
                <a href="/tasks" style={{ color: '#666', textDecoration: 'none' }}>Tasks</a>
                <a href="/analytics" style={{ color: '#666', textDecoration: 'none' }}>Analytics</a>
                <a href="/profile" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '500' }}>Profile</a>
              </nav>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#666' }}>Welcome, {user.username}!</span>
              <button 
                onClick={handleLogout}
                style={{
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header> */}
      <Navbar />

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Profile & Settings</h2>
          <p style={{ color: '#666' }}>Manage your account settings and preferences</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Personal Information</h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isSaving && <div className="loading-spinner" style={{ width: '14px', height: '14px' }}></div>}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input-field"
                    placeholder="Enter your first name"
                  />
                ) : (
                  <p style={{ padding: '8px 0', color: profile.firstName ? '#333' : '#9ca3af' }}>
                    {profile.firstName || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input-field"
                    placeholder="Enter your last name"
                  />
                ) : (
                  <p style={{ padding: '8px 0', color: profile.lastName ? '#333' : '#9ca3af' }}>
                    {profile.lastName || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Username
              </label>
              <p style={{ padding: '8px 0', color: '#333', fontSize: '16px', fontWeight: '500' }}>
                {profile.username}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Email Address
              </label>
              <p style={{ padding: '8px 0', color: '#333' }}>
                {profile.email}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="input-field"
                  rows={3}
                  placeholder="Tell us about yourself"
                  style={{ resize: 'vertical' }}
                />
              ) : (
                <p style={{ padding: '8px 0', color: profile.bio ? '#333' : '#9ca3af' }}>
                  {profile.bio || 'No bio added yet'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e5e7eb' }}>
            Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>
                Daily Task Goal
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.taskGoal}
                    onChange={(e) => setProfile(prev => ({ ...prev, taskGoal: parseInt(e.target.value) || 0 }))}
                    className="input-field"
                    style={{ width: '100px' }}
                    min="1"
                    max="50"
                  />
                ) : (
                  <span style={{ fontSize: '18px', fontWeight: '600', color: '#0066cc' }}>
                    {profile.taskGoal}
                  </span>
                )}
                <span style={{ color: '#666' }}>tasks per day</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontWeight: '500' }}>Email Notifications</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Receive email updates about task deadlines and completions
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={profile.emailNotifications}
                  onChange={(e) => setProfile(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                  disabled={!isEditing}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ color: isEditing ? '#333' : '#9ca3af' }}>
                  {profile.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontWeight: '500' }}>Dark Mode</h4>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                  Toggle between light and dark theme
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={profile.darkMode}
                  onChange={(e) => setProfile(prev => ({ ...prev, darkMode: e.target.checked }))}
                  disabled={!isEditing}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ color: isEditing ? '#333' : '#9ca3af' }}>
                  {profile.darkMode ? 'Dark' : 'Light'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e5e7eb' }}>
            Account Actions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button
              onClick={() => alert('Password change functionality would be implemented here')}
              style={{
                backgroundColor: '#f0f0f0',
                color: '#333',
                border: '1px solid #ddd',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '16px'
              }}
            >
              Change Password
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  alert('Account deletion would be implemented here');
                }
              }}
              style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                padding: '12px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '16px'
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

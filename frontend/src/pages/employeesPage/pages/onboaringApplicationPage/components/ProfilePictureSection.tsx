import React from 'react';

interface ProfilePictureSectionProps {
  profilePicture: File | null;
  setProfilePicture: (file: File | null) => void;
}

export function ProfilePictureSection({ profilePicture, setProfilePicture }: ProfilePictureSectionProps): React.ReactNode {
  return (
    <section>
      <h2>头像</h2>
      <div>
        <div>
          {profilePicture ? (
            <img src={URL.createObjectURL(profilePicture)} alt="头像预览" />
          ) : (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
        />
      </div>
    </section>
  );
} 
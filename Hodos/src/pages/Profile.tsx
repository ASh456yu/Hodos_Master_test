import React, { useEffect, useRef, useState } from 'react'
import { handleError, handleSuccess } from '../components/utils';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Scan, Mail, Building, Users, Upload, Camera } from 'lucide-react';
import '../styles/Profile.css'


interface User {
  name: string;
  email: string;
  department: string;
  company: string;
  position: string;
  image: string;
}

const Profile: React.FC = () => {
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/auth/userinfo`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUserDetail(data.user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setUserDetail((prev) => prev ? { ...prev, image: reader.result as string } : null);
      };

      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadPic = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleUpload(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  async function handleUpload(file: File) {
    if (!file) {
      handleError("Upload a policy first");
      return;
    }

    try {

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/upload-policy`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentType: 'application/pdf'
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get the upload URL");
      }

      const { url, fileName } = await response.json();

      // Upload the file to S3 using the pre-signed URL
      const uploadResponse = await axios.put(url, file, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (uploadResponse.status === 200) {
        handleSuccess("File uploaded successfully");
        console.log(`${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/process-uploaded-file}`);

        const notifyResponse = await fetch(
          `${import.meta.env.VITE_SERVER_LOCATION.split(',')[0]}/general/process-uploaded-file`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileName,
            }),
          }
        );
        if (notifyResponse.ok) {
          handleSuccess("File uploaded successfully and queued for processing");
        } else {
          handleError("File uploaded but processing request failed");
        }
      } else {
        throw new Error("File upload failed");
      }

    } catch (error) {
      handleError("Some error occurred during upload");
    }
  }

  return (
    <div className="profile-container">
      {userDetail ? (
        <>
          <div className="profile-header">
            <div className="profile-cover"></div>
            <div className="profile-avatar-container">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <div className="profile-avatar-wrapper">
                <img
                  className="profile-avatar"
                  src={userDetail.image == null ? "/profile.jpg" : userDetail.image}
                  alt="Profile"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                />
                <div className="profile-avatar-edit">
                  <Camera size={18} />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-info-card">
              <div className="profile-info-header">
                <h1 className="profile-name">{userDetail.name}</h1>
              </div>

              <div className="profile-title">
                <Building size={16} className="profile-icon" />
                <p>{userDetail.position} at {userDetail.company}</p>
              </div>

              <div className="profile-details">
                <div className="profile-detail-item">
                  <Users size={16} className="profile-icon" />
                  <p>Department: {userDetail.department}</p>
                </div>
                <div className="profile-detail-item">
                  <Mail size={16} className="profile-icon" />
                  <p>Email: {userDetail.email}</p>
                </div>
              </div>

              <div className="profile-actions">
                {user && user.isAuthorized ? (
                  <button
                    className="profile-upload-button"
                    onClick={handleUploadPic}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      hidden
                    />
                    <Scan size={18} />
                    <span>Upload Policy</span>
                  </button>
                ) : (
                  <button className="profile-upload-button profile-upload-button-disabled">
                    <Upload size={18} />
                    <span>Policy Upload</span>
                    <div className="profile-unauthorized-note">
                      You are unauthorized. Please contact support team.
                    </div>
                  </button>
                )}
                &nbsp;
                <button
                  onClick={() => window.open(`${import.meta.env.VITE_CLIENT_LOCATION.split(',')[1]}`, "_blank", "noopener,noreferrer")}
                  className="profile-link-button"
                >
                  Switch to Employee Page
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="profile-loading">
          <div className="profile-loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      )}
      <ToastContainer />
    </div>
  )
}

export default Profile



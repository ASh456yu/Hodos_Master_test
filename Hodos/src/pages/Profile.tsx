import { Scan } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { handleError, handleSuccess } from '../components/utils';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';

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
        <>

            {userDetail ? (
                <div>
                    <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                    <img
                        src={userDetail.image == null ? "/profile.jpg" : userDetail.image}
                        alt="Profile"
                        onClick={() => document.getElementById('imageUpload')?.click()}
                    />
                    <h2>{userDetail.name}</h2>
                    <p>{userDetail.position} at {userDetail.company}</p>
                    <p>Department: {userDetail.department}</p>
                    <p>Email: {userDetail.email}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
            <div onClick={handleUploadPic}>
                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    hidden
                />
                <Scan size={20} />
                <span>Upload Policy</span>
            </div>
            <ToastContainer />
        </>
    )
}

export default Profile



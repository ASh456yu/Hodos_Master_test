import { Scan } from 'lucide-react';
import React, { useRef } from 'react'
import { handleError, handleSuccess } from '../components/utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Profile: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
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
            } else {
                throw new Error("File upload failed");
            }
            const userId = user._id
            const response2 = await fetch("http://127.0.0.1:8000/extract", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ fileName, userId }),
            });

            const data = await response.json();

            if (response2.ok) {
                handleSuccess(`Success! Markdown file created at: ${data.markdown_file}`);
            } else {
                handleError(`Error: ${data.detail}`);
            }
        } catch (error) {
            handleError("Some error occurred during upload");
        }
    }

    return (
        <div>

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

        </div>
    )
}

export default Profile

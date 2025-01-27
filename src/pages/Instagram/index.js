import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Instagram = () => {
  const [loader, setLoader] = useState(false);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState([]); // Store multiple image/video files
  const [mediaPreviews, setMediaPreviews] = useState([]); // Store previews for all media

  const clientId = process.env.REACT_APP_INSTA_CLIENT_ID;
  const instaAppSecret = process.env.REACT_APP_INSTA_APP_SECRET;
  const redirectUri = 'https://49dmh7px-3000.euw.devtunnels.ms/instagram';
  const scope = `instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages,instagram_business_content_publish`;
  const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

  
  const handleLogin = () => {
    window.location.href = authUrl;
  };

  // Function to handle multiple media uploads
  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setMedia(files); // Store files
    setMediaPreviews((oldPreviews) => [...oldPreviews, ...newPreviews]);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const postToInstagram = async () => {
    const accessToken = localStorage.getItem('instagramToken');
    const instagramUserId = localStorage.getItem('instagramUserId');
    if (!accessToken) {
      console.error('No access token found!');
      return;
    }

    try {
      for (const file of media) {
        // For simplicity, assume the media files have already been uploaded to a public URL.
        const mediaResponse = await fetch(
          `https://graph.instagram.com/v21.0/${instagramUserId}/media?image_url=${encodeURIComponent(
            'https://picsum.photos/200/300'
          )}&media_type=STORIES&caption=${encodeURIComponent(caption)}&access_token=${encodeURIComponent(accessToken)}`,
          {
            method: 'POST',
          }
        );

        const mediaResponseData = await mediaResponse.json();
        const mediaId = mediaResponseData.id;

        // Step 2: Publish media
        await fetch(
          `https://graph.instagram.com/v21.0/${instagramUserId}/media_publish?creation_id=${mediaId}&access_token=${accessToken}`,
          { method: 'POST' }
        );
      }

      console.log('All posts published!');
    } catch (error) {
      console.error('Error publishing posts:', error);
    }
  };

  const location = useLocation();

  useEffect(() => {
    setLoader(true);
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      fetch(`https://49dmh7px-3003.euw.devtunnels.ms/api/webhook/instagram/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoader(false);
          const shortLivedToken = data?.tokenData?.access_token;
          if (shortLivedToken) {
            fetch(
              `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${instaAppSecret}&access_token=${shortLivedToken}`
            )
              .then((response) => response.json())
              .then((tokenData) => {
                if (tokenData?.access_token) {
                  localStorage.setItem('instagramToken', tokenData.access_token);
                  localStorage.setItem('instagramUserId', data.tokenData.user_id);
                  window.location.href = redirectUri;
                } else {
                  console.error('Error fetching long-lived token:', tokenData);
                }
              })
              .catch((error) => console.error('Error exchanging for long-lived token:', error));
          }
        })
        .catch((error) => {
          setLoader(false);
          console.error(error);
        });
    } else {
      setLoader(false);
    }
  }, [location.search]);

  return (
    <div className="Instagram flex flex-col items-center justify-center h-full">
      <div className='max-w-[500px] w-full text-center'>
      {loader ? (
        <div>Loading...</div>
      ) : (
        <>
          <button
            onClick={handleLogin}
            type="button"
            className="mb-5 inline-block rounded bg-[#c13584] px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md"
          >
            Login to Instagram
          </button>

          {/* Media Upload */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*,video/*"
              multiple // Enable multiple file selection
              onChange={handleMediaChange}
              className="mb-2"
            />
            <div className="flex gap-2">
              {mediaPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover"
                />
              ))}
            </div>
          </div>

          {/* Caption Input */}
          <div className="mb-4">
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={handleCaptionChange}
              rows={3}
              className="border p-2 w-full rounded"
            />
          </div>

          {/* Publish Button */}
          <button
            onClick={postToInstagram}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Post to Instagram
          </button>
        </>
      )}

      </div>
    </div>
  );
};

export default Instagram;

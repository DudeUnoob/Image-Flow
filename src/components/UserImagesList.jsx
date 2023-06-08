import { ImageList, ImageListItem } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../functions/supabaseConnect';

export default function UserImageList({ imageList, user }) {
  const [updatedImgUrls, setUpdatedImgUrls] = useState([]);
  const testRef = useRef(null);
  const id = user?.id;

  useEffect(() => {
    async function downloadAndProcessImages() {
      const filterNull = imageList.filter((item) => item.name !== ".emptyFolderPlaceholder");

      await Promise.all(
        filterNull.map(async (elm) => {
          const { data, error } = await supabase.storage.from("files").download(`${id}/${elm.name}`);
          if (!error) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                const imgURL = e.target.result;
                resolve(imgURL);
              };
              reader.readAsDataURL(data);
            });
          }
          return null;
        })
      ).then((imgURLs) => {
        const filteredURLs = imgURLs.filter((url) => url !== null);
        setUpdatedImgUrls(filteredURLs);
      });
    }

    if (imageList && imageList.length > 0 && id) {
      downloadAndProcessImages();
    }
  }, [user, imageList, id]);

  return (
    <div className="image_list" ref={testRef}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {updatedImgUrls.map((url, index) => (
          <ImageListItem key={index}>
            <img src={url} srcSet={url} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}

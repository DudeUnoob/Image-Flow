import { CircularProgress, ImageList, ImageListItem, Paper, Skeleton, Typography } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../functions/supabaseConnect';
import "../styles/css/UserImagesList.css"

export default function UserImageList({ imageList, user }) {
  const [updatedImgUrls, setUpdatedImgUrls] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const testRef = useRef(null);
  const id = user?.id;
  
  useEffect(() => {
    if(imageList.length == 0){
      setImagesLoaded(true)
    }
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
        setImagesLoaded(true)
      });
    }

    if (imageList && imageList.length > 0 && id) {
      downloadAndProcessImages();
    }
  }, [user, imageList, id]);

  return (
    <>
      <div className="heading">
        <h1>Image Gallery</h1>
      </div>
      <Paper elevation={3} sx={{ padding: "20px", margin: "0 auto", borderRadius: "15px", width: "80%", cursor: "pointer", marginTop: "20px" }}>
        <div className="skeleton-container" style={{ display: "flex", gap: "50px", margin: "0 auto", justifyContent: "space-evenly", alignItems: 'center' }}>
          {!imagesLoaded && (
            <>
              <Skeleton height={225} width={300} animation={"wave"} />
              <Skeleton height={225} width={300} animation={"wave"} />
              <Skeleton height={225} width={300} animation={"wave"} />


            </>
          )}
        </div>
        {!imagesLoaded && (
          <div className="circular-progress" style={{ justifyContent:"center", margin:"0 auto", display:'flex'}}>
          <CircularProgress />
          </div>
        )}

        <div className="image_list" ref={testRef}>
          {imageList.length == 0 ? <h2 style={{textAlign:'center', color:"#979797"}}>No Images - Add some! 📸</h2> : <p>Bye</p>}
          <ImageList variant="masonry" cols={4} gap={8} >
            {updatedImgUrls.map((url, index) => (
              <ImageListItem key={index}>
                <img src={url} srcSet={url} loading='lazy' id="file_images" />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </Paper>
    </>
  );
}

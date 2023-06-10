import { CircularProgress, ImageList, ImageListItem, Paper, Skeleton, Typography } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../functions/supabaseConnect';
import "../styles/css/UserImagesList.css"
import { Menu } from '@mantine/core';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import { DeleteOutline } from '@mui/icons-material';
import { Modal, Button } from 'react-bootstrap';


export default function UserImageList({ imageList, user }) {
  const [updatedImgUrls, setUpdatedImgUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false)
  const [selectedDelImg, setSelectedDelImg] = useState({})
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const [imagesLen, setImagesLen] = useState()
  const testRef = useRef(null);
  const id = user?.id;

  const [deletedImageIndex, setDeletedImageIndex] = useState(-1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleModalState = () => setShow(currentShowState => !currentShowState);

  useEffect(() => {
    if (imageList.length === 0) {
      setUpdatedImgUrls([]);
      setIsLoading(false);
      setImagesLen("no images")
      return;
    }
    
    async function downloadAndProcessImages() {
      setIsLoading(true);
      setAreImagesLoaded(false);
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
        setIsLoading(false);
        setAreImagesLoaded(true);
      });
    }

    if (imageList && imageList.length > 0 && id) {
      downloadAndProcessImages();
    }
  }, [user, imageList, id]);

  const handleDeleteImage = (image, index) => {
    handleModalState();
    setSelectedDelImg(image);
    setDeletedImageIndex(index);
    setDeleteConfirmation(false);
  };

  useEffect(() => {
    async function executeDeleteImage() {
      if (deletedImageIndex !== -1 && deleteConfirmation) {
        const deletedImageUrl = updatedImgUrls[deletedImageIndex];
        // Delete the associated image using the deletedImageUrl or any necessary logic
        // You can access the deleted image's data from selectedDelImg state if needed
        // ...
        
        // After deleting the image, update the state to reflect the changes
        const updatedUrls = [...updatedImgUrls];
        updatedUrls.splice(deletedImageIndex, 1);
        setUpdatedImgUrls(updatedUrls);
        setDeletedImageIndex(-1);
        setDeleteConfirmation(false);
        handleModalState()
        const { data, error } = await supabase.storage.from("files").remove([`${id}/${selectedDelImg.name}`]) 
      }
    }

    executeDeleteImage()
   
  }, [deletedImageIndex, updatedImgUrls, deleteConfirmation]);

  return (
    <>
      <div className="heading">
        <h1>Image Gallery</h1>
      </div>
      <Paper elevation={3} sx={{ padding: "20px", margin: "0 auto", borderRadius: "15px", width: "80%", cursor: "pointer", marginTop: "20px" }}>
        <div className="skeleton-container" style={{ display: "flex", gap: "50px", margin: "0 auto", justifyContent: "space-evenly", alignItems: 'center' }}>
          {isLoading || !areImagesLoaded ? (
            <>
              <Skeleton height={225} width={300} animation={"wave"} />
              <Skeleton height={225} width={300} animation={"wave"} />
              <Skeleton height={225} width={300} animation={"wave"} />
            </>
          ) : null}
        </div>
        {isLoading || !areImagesLoaded ? (
          <div className="circular-progress" style={{ justifyContent: "center", margin: "0 auto", display: 'flex' }}>
            <CircularProgress />
          </div>
        ) : null}

        <div className="image_list" ref={testRef}>
          {imageList.length === "no images" ? (
            <h2 style={{ textAlign: 'center', color: "#979797" }}>No Images - Add some! 📸</h2>
          ) : (
            <ImageList variant="masonry" cols={4} gap={8}>
              {updatedImgUrls.map((url, index) => (
                <Menu key={index} trigger='hover'>
                  <Menu.Target>
                    <ImageListItem>
                      <img src={url} srcSet={url} loading='lazy' id="file_images" key={index} />
                    </ImageListItem>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Image</Menu.Label>
                    <Menu.Item icon={<PhotoCameraIcon sx={{ fontSize: 15 }} />}>{imageList[index + 1].name}</Menu.Item>
                    <Menu.Item>Added: {new Date(imageList[index + 1].created_at).toLocaleDateString("en-US")}</Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Danger Zone</Menu.Label>
                    <Menu.Item
                      color='red'
                      icon={<DeleteOutline sx={{ fontSize: 18 }} />}
                      onClick={() => handleDeleteImage(imageList[index + 1], index)}
                    >
                      Delete Image
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ))}
            </ImageList>
          )}
        </div>
      </Paper>

      <Modal show={show} onHide={handleModalState}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <b>{selectedDelImg.name}?</b>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleModalState}>Close</Button>
          <Button variant='danger' onClick={() => setDeleteConfirmation(true)}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

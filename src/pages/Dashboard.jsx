import { createRef, forwardRef, useEffect, useRef, useState } from "react"
import { authMiddleware } from "../functions/authMiddleware"
import { useNavigate } from "react-router-dom"
import { UserContext, UserProvider, useUser, useUserUpdate } from "../context/UserContext"
import { IconButton, Fab, } from "@mui/material"
import { AddCircle, } from "@mui/icons-material"
import { Button, Modal } from "react-bootstrap"
import AddIcon from '@mui/icons-material/Add';
import { supabase } from "../functions/supabaseConnect"
import { ToastContainer, toast } from "react-toastify"
import { Text, Image, SimpleGrid } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, } from '@mantine/dropzone';
import DropzoneComponentWrapper from "../components/DropzoneComponentWrapper"
import * as tus from "tus-js-client"



export default function Dashboard() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [show, setShow] = useState(false)
    const fileInputRef = useRef(null)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {

        authMiddleware().then((data) => {

            if (data == null) {
                navigate('/login')
            } else {
                setUserData(data)

                async function createBucket() {
                     await supabase.storage.from("files").list(`${data.id}`).then((k) => console.log(k))
                    
                    if (data && data.id) { // Add null check for userData and userData.id
                        const { re, error } = await supabase.storage.from('files').upload(`${data.id}/*.txt`, '')

                        const { reBack, err } = await supabase.storage.from('files').remove([`${data.id}/*.txt`])

                        if (err) {
                            toast.error('Looks like there\'s a duplicate file for this resource!', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }
                    }


                }
                createBucket()
            }


        })



    }, [])


    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}

            />
        );
    });

    function handleAddButton() {
        setShow(currentState => !currentState)

    }

    const handleFileUpload = (event) => {


        submitImages(files)
    }

    async function submitImages(files) {


        const formData = new FormData()

        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i])
            console.log(files[i])
            const { data, error } = await supabase.storage.from('files').upload(`${userData.id}/${files[i].name}`, files[i], {
                onProgress: (event) => {
                    console.log(event)
                    const progress = Math.round((event.loaded * 100) / event.total);
                    setUploadProgress(progress);
                },
            })


            data ? toast.success('Successfully uploaded image(s)!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }) : toast.error(`There was an error uploading your image!\n Status Code: ${error.statusCode} - ${error.error}: ${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });



        }


    }

    

    return (
        <>
            <div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Images</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Upload Images to Gallery</Modal.Body>

                    <div>
                        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles} id="file-input" >
                            <Text align="center">Drop images here</Text>
                        </Dropzone>

                        <SimpleGrid
                            cols={4}
                            breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                            mt={previews.length > 0 ? 'xl' : 0}

                        >
                            {previews}
                        </SimpleGrid>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={(e) => handleFileUpload(e)}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            </div>
            <div style={{ position: "fixed", bottom: "0", right: "0" }} className="new-button" >
                <Fab color="primary" aria-label="add" size="medium" sx={{ mr: "5px", mb: "8px" }} onClick={handleAddButton}>
                    <AddIcon />
                </Fab>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />
        </>
    )
}
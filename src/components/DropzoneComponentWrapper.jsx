import { Text } from '@mantine/core';
import { Dropzone, } from '@mantine/dropzone';
import React, { useState, useEffect, forwardRef } from 'react';
const DropzoneComponentWrapper = forwardRef((props, reference) => {

    const { IMAGE_MIME_TYPE, setFiles, ref } = props
    console.log(props)
    return (<Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles} id="file-input" ref={ref}>
        <Text align="center">Drop images here</Text>
    </Dropzone>)
})

export default DropzoneComponentWrapper
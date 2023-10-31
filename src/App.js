import { React, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';
import { VideoUploader } from '@api.video/video-uploader'

function App() {

    const inputFile = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState({ value: 0, max: 0 });
    const [videos, setVideos] = useState([]);
    const [callOngoin, setCallOngoin] = useState(false);
    const [bearer, setBearer] = useState('');
    const apikey = 'I7MpY7hzZr5vMPywjJ5K7mP1R6HQM1wd2h9jbhYER98';

    function uploadFile(file) {

        const uploader = new VideoUploader({
            file,
            uploadToken: "to2Srn6o4IHvwxNZ984PDU8h"
        });

        uploader.onProgressCallbacks.push((e) => {
            setProgress({ value: e.uploadedBytes, max: e.totalBytes });
        });

        let p = uploader.upload();

        p.then((e) => {
            console.log('then', e)
        });

        p.finally(() => {
            listVideos();
            console.log('finally');
        })

        p.catch((e) => {
            console.log('errorrrrr');
        });
    }

    const listVideos = () => {
        if (bearer) {
            axios.get('https://ws.api.video/videos', { headers: { Authorization: 'Bearer ' + bearer } })
                .then((res) => {
                    setVideos(res.data.data);
                });
        }
    }
    
    const fileInputChange = (e) => {
        console.log(inputFile)
        
        if (inputFile.current?.files && inputFile.current.files.length > 0) {
            uploadFile(inputFile.current.files[0]);
        }
    }

    const getBearer = () => {
        if (!callOngoin) {
            setCallOngoin(true);
            axios.post('https://ws.api.video/auth/api-key', { apiKey: apikey })
                .then((res) => 
                    setBearer(res.data.access_token)
                )
                .finally(() =>
                    setCallOngoin(false)
                );
        }
    }

    useEffect(() => getBearer(), []);

    return (
        <div className="App">
            <div className="upload-container">
                <input
                    ref={inputFile}
                    type="file"
                    id="file-input"
                    accept="video/mp4,video/x-m4v,video/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <input
                    type="button"
                    value="upload"
                    onClick={fileInputChange}
                />
                <progress value={progress?.value} max={progress?.max} />
            </div>
            <div className="video-container">
                <input
                    type="button"
                    value="listVideos"
                    onClick={listVideos}
                />
                {videos.map((e) => <div key={e.videoId}>{e.videoId}</div>)}
            </div>
        </div>
    );
}

export default App;

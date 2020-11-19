import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
const ffmpeg = createFFmpeg({ log: true })

function App() {
  const [ready, setReady] = useState(false)
  const [video, setVideo] = useState() /* starts as undefined */
  const [gif, setGif] = useState()

  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  const convertToGif = async () => {
    //Write the file to memory
    ffmpeg.FS('writeFile','test.mp4', await fetchFile(video))

    await ffmpeg.run('-i', 'test.mp4', '-t', '12.5', '-ss', '10.0', '-f', 'gif', 'out.gif')

    const data = ffmpeg.FS('readFile', 'out.gif')

    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}))
    setGif(url)
  }

  return ready ? (
    <div className="App">
      <div>

        { video &&
          <video
          controls
          width="250"
          src={URL.createObjectURL(video)}
          ></video>
        }

        <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      </div>
     
      <div>

        <h3>Result</h3>

        <button onClick={convertToGif}>Convert</button>
        {gif && 
          <img 
          src={gif} 
          alt=""
          width="250"
          />
        }
    
      </div>
    </div>
  ):
  (<p>Loading...</p>)
}

export default App;

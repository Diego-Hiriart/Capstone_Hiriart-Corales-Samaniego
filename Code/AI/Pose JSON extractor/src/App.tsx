import { useEffect, useState } from 'react';
import './App.css';
/*
 * Done using https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/demos/upload_video
 * as a reference
 */
import { poseDetectionAI } from './ai-pose-detection/index';

function App() {
  interface ExtractionFormTypes {
    posesPacketSize: number;
    videoFile: File;
  }
  //JSON to store poses
  const [posesJSON, setPosesJSON] = useState<Array<any> | null>(null);
  //Defines the amount of keypoints to be packed together and added to the JSON
  const [extractionFormData, setExtractionFormData] =
    useState<ExtractionFormTypes>({
      posesPacketSize: 10,
      videoFile: new File([new Blob()], ''),
    });

  function handleFormChange(e: any) {
    e.preventDefault();
    let fieldValue;
    if (e.target.type === 'file') {
      fieldValue = e.target.files[0];
    } else {
      fieldValue = e.target.value; //Get the value of the field
    }
    const fieldName = e.target.getAttribute('name'); //Get the name field
    const newFormData = { ...extractionFormData }; //Get the current state
    newFormData[fieldName as keyof typeof newFormData] = fieldValue; //Update the value of a field

    setExtractionFormData(newFormData); //Update state
  }

  async function extractJSON(e: React.FormEvent) {
    e.preventDefault(); //Dont reload page
    //Call AI function
    let extractionData: ExtractionFormTypes = {
      posesPacketSize: extractionFormData.posesPacketSize,
      videoFile: extractionFormData.videoFile,
    };
    let extractedPoses = await poseDetectionAI(extractionData);
    setPosesJSON(extractedPoses);
  }

  useEffect(() => {
    console.log(posesJSON);
    if (
      posesJSON !== null &&
      posesJSON !== undefined &&
      posesJSON[0].length !== 0
    ) {
      alert('downloading poses JSON');
      const a = document.createElement('a');
      const file = new Blob([JSON.stringify(posesJSON)], {
        type: 'text/plain',
      });
      a.href = URL.createObjectURL(file);
      let fileName = extractionFormData.videoFile.name;
      fileName = `${fileName.substring(
        0,
        fileName.lastIndexOf('.')
      )}_poses-JSON.json`;
      a.download = fileName;
      a.click();
    }
  }, [posesJSON]);

  return (
    <div className='App'>
      <h1>Capstone Hiriart Corales Samaniego</h1>
      <h2>Academia de Egrima Ciudad de Quito</h2>
      <h3>Pose JSON extractor</h3>
      <p>
        Using BlazePose "heavy", detect poses in an uploaded video and extract
        the JSONs corresponding to poses in said video
      </p>
      <div className='container'>
        <div className='canvas-wrapper'>
          <form onSubmit={(e) => extractJSON(e)}>
            <div className='formField'>
              <label>
                Poses packet size/poses per second (amount of keypoints to be
                packed together and added to the JSON)
              </label>
              <input
                name='posesPacketSize'
                onChange={(e) => handleFormChange(e)}
                type='number'
                required
              ></input>
            </div>
            <div className='formField'>
              <label>Video file</label>
              <input
                name='videoFile'
                type='file'
                accept='video/*'
                onChange={(e) => handleFormChange(e)}
                required
              ></input>
            </div>
            <button type='submit'>Extract</button>
          </form>
          <span className='status-section'>
            <label>Extraction status: </label>
            {posesJSON == null ? (
              <p>Extraction incomplete</p>
            ) : (
              <>
                {posesJSON[0].length !== 0 ? (
                  <p>Extraction done, downloading file</p>
                ) : (
                  <p>Extraction in process</p>
                )}
              </>
            )}
          </span>
          <video className='output-canvas webcam-pane' id='video'>
            <source id='currentVID' src='' type='video/mp4' />
          </video>
          <canvas className='output-canvas render-pane' id='output'></canvas>
        </div>
        <div id='scatter-gl-container'></div>
      </div>
    </div>
  );
}

export default App;

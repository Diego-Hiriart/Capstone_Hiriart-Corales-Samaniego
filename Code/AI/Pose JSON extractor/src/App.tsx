import { useState } from 'react';
import './App.css';
/*
 * Done using https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/demos/upload_video
 * as a reference
 */
import { poseDetectionAI } from './ai-pose-detection/index';

function App() {
  interface ExtractionForm {
    posesPacketSize: number;
    videoFile: File;
    extract2D: Boolean;
  }
  //Defines the amount of keypoints to be packed together and added to the JSON
  const [extractionFormData, setExtractionFormData] = useState<ExtractionForm>({
    posesPacketSize: 10,
    videoFile: new File([new Blob()], ''),
    extract2D: false,
  });

  function handleFormChange(e: any) {
    let fieldValue;
    if (e.target.type === 'file') {
      fieldValue = e.target.files[0];
    } else if (e.target.type == 'checkbox') {
      fieldValue = e.target.checked;
    } else {
      fieldValue = e.target.value; //Get the value of the field
      e.preventDefault();
    }
    const fieldName: keyof ExtractionForm = e.target.getAttribute('name'); //Get the name field
    const newFormData = { ...extractionFormData }; //Get the current state
    newFormData[fieldName] = fieldValue; //Update the value of a field

    setExtractionFormData(newFormData); //Update state
  }

  async function extractJSON(e: React.FormEvent) {
    e.preventDefault(); //Dont reload page
    //Call AI function
    let extractionData: ExtractionForm = {
      posesPacketSize: extractionFormData.posesPacketSize,
      videoFile: extractionFormData.videoFile,
      extract2D: extractionFormData.extract2D,
    };
    poseDetectionAI(extractionData);
  }

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
                Poses packet size (amount of keypoints to be packed together and
                added to the JSON)
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
            <div className='formField'>
              <label>Extract 2D</label>
              <input
                name='extract2D'
                type='checkbox'
                onChange={(e) => handleFormChange(e)}
              ></input>
            </div>
            <button type='submit'>Extract</button>
          </form>
          <span className='status-section'>
            <label>Extraction status: </label>
            <p id='extraction-status'>Extraction incomplete</p>
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

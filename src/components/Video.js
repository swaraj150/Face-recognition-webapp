import React, { useEffect, useRef, useContext } from 'react'
import * as faceapi from 'face-api.js';
import TextContext from '../context/textContext';
import {useNavigate} from 'react-router-dom';

const Video = () => {
  let context=useContext(TextContext);
  const {showalert}=context;
  const navigate=useNavigate();
  const navigateAttendance=()=>{
    navigate("/attendance");   
  }
  // const navigateAttendence=async ()=>{
  //   const response=fetch("http://localhost:8000/api/create/getadmin",{
  //           method:"GET",
  //           headers:{
  //               'Content-Type':'application/json',
  //               'auth-token':localStorage.getItem("auth-token")
  //           },
  //       });
  //       const json=(await response).json();
  //       json.then((response) => {
  //         if (response.success) {
  //             navigate("/attendence");   
  //         }
  //         else if (!localStorage.getItem("auth-token")) {
  //             showalert("Admin login required", "danger");
  //         }
  //         else {
  //             showalert("Invalid account no.", "danger");
  //         }
  //     }).catch(() => {
  //         showalert("some error occured", "danger");
          
  //     })
  // }

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const buttonref = useRef(null);


  useEffect(() => {
    const loadmodels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models')

      ]).then(handleplay);
    }
    loadmodels();


  }, [])

  const handleplay = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 520, height: 520 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error(err);
      })
  }
  const handleonplay = async () => {
    const labeledDescriptors = await loadLabledImages()
    console.log(labeledDescriptors);
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);
    setInterval(async () => {
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current)
      const displaySize = {
        width: 520,
        height: 520
      }
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvasRef.current.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, 520, 520);
      //https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-getimagedata


      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor)
      })
      const present = results.map(label => {
        return label.toString();
      })
      const properResults = present.map(label => {
        return label.split("(")[0];
      })

      await Promise.all(properResults.map(async(name)=>{
        const response = fetch("http://localhost:8000/api/create/getstudent", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name":name})
      });
      const json = (await response).json();
      console.log(json);
      json.then(response=>{
        if(response.success){
          showalert(`Attendance Marked Successfully for student ${response.status.name}`,"success");
        }
        else{
          showalert(`Something went wrong `,"danger");
        }
      })
      }))
      
      results.map((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
        drawBox.draw(canvasRef.current);
      })

      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);

    }, 3000)

  }


  const loadLabledImages = () => {
    const labels = ['Swaraj Andhale', 'Sangita Andhale'];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withFaceExpressions();
          console.log(label + i + JSON.stringify(detections));
          descriptions.push(detections.descriptor);

        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    )
  }
  return (
    <>
      <div className="display-flex justify-content-center margin ">
        <video ref={videoRef} onPlay={handleonplay}></video>
        <canvas ref={canvasRef} className="position-absolute" />
      </div>
      <div className="display-flex justify-content-center margin ">
        <button ref={buttonref} type='button'className="btn btn-success" id='btn1' onClick={navigateAttendance}>View Attendance</button>
      </div>


    </>

  )
}


export default Video

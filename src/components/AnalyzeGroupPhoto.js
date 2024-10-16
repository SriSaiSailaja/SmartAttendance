import React, { useState } from "react";
import { firestore } from "../firebaseConfig"; // Ensure correct import
import * as faceapi from "@vladmandic/face-api";
import { collection, getDocs } from "firebase/firestore"; // Import Firestore functions

const AnalyzeGroupPhoto = () => {
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  };

  const handleGroupPhotoUpload = async () => {
    if (groupPhoto) {
      const img = await faceapi.bufferToImage(groupPhoto);
const resizedImg = faceapi.resizeResults(img, { width: 640, height: 480 }); // Resize to a smaller dimension
     return resizedImg;
    }
    return null;
  };

  const analyzePhoto = async (img) => {
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    // Fetch students from Firestore
    const studentsSnapshot = await getDocs(collection(firestore, "students")); // Correctly using Firestore v9 method
    const studentList = studentsSnapshot.docs.map((doc) => doc.data());

    const studentDescriptors = await Promise.all(studentList.map(async (student) => {
      try {
        const studentImg = await faceapi.fetchImage(student.photoURL);
        const studentDescriptor = await faceapi.detectAllFaces(studentImg)
          .withFaceLandmarks()
          .withFaceDescriptors();
        return { 
          rollNumber: student.rollNumber, 
          descriptor: studentDescriptor[0]?.descriptor || null 
        };
      } catch (error) {
        console.error(`Error fetching or processing image for ${student.name}:`, error);
        return { rollNumber: student.rollNumber, descriptor: null }; // Return null descriptor if an error occurs
      }
    }));

    // Filter out students with null descriptors
    const validStudentDescriptors = studentDescriptors.filter(desc => desc.descriptor);

    const absentees = studentList.filter(student => {
      const studentDescriptor = validStudentDescriptors.find(d => d.rollNumber === student.rollNumber);
      if (!studentDescriptor) return true; // Mark as absent if descriptor not found
      return !detections.some(detection => {
        const match = faceapi.euclideanDistance(detection.descriptor, studentDescriptor.descriptor);
        return match < 0.6; // Match threshold
      });
    });

    setAbsentees(absentees);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loadModels(); // Load models before processing the image
      const img = await handleGroupPhotoUpload();
      await analyzePhoto(img);
    } catch (error) {
      console.error("Error analyzing group photo: ", error);
      alert("Analysis failed! Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Analyze Group Photo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setGroupPhoto(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Photo"}
        </button>
      </form>

      {absentees.length > 0 && (
        <div>
          <h2>Absent Students</h2>
          <ul>
            {absentees.map((student) => (
              <li key={student.rollNumber}>
                {student.name} (Roll No: {student.rollNumber})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalyzeGroupPhoto;

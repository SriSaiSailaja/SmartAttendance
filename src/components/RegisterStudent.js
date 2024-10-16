import React, { useState } from "react";
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import { firestore, storage } from "../firebaseConfig"; // Import Firestore and Storage from your config

const RegisterStudent = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle photo upload
  const handlePhotoUpload = async () => {
    if (photo) {
      const storageRef = ref(storage, `students/${rollNumber}`); // Create a reference to the 'students' folder

      try {
        // Upload the file to Firebase Storage
        const fileSnapshot = await uploadBytes(storageRef, photo);

        // Get the download URL of the uploaded photo
        const downloadURL = await getDownloadURL(fileSnapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error("Photo upload failed:", error);
        throw new Error("Photo upload failed");
      }
    }
    return null;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload the photo and get the download URL
      const photoURL = await handlePhotoUpload();

      // Store the student data in Firestore
      await addDoc(collection(firestore, "students"), {
        name,
        rollNumber,
        photoURL,
      });

      alert("Student registered successfully!");

      // Clear the form fields after submission
      setName("");
      setRollNumber("");
      setPhoto(null);
    } catch (error) {
      console.error("Error registering student: ", error);
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Register Student</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register Student"}
        </button>
      </form>
    </div>
  );
};

export default RegisterStudent;

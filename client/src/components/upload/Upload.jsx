import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import "./upload.scss";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { AuthContext } from "../../context/authCOntext";

export default function Upload({ setOpen }) {
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [videoPerc, setVideoPerc] = useState(0);
  const [imgPrec, setImgPerc] = useState(0);
  const [tags, setTags] = useState([]);
  const [info, setInfo] = useState({});
  const queryClient = new useQueryClient();
  const {currentUser} = useContext(AuthContext)

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new window.Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImgPerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInfo((prev) => ({ ...prev, [urlType]: downloadURL }));
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, "imgUrl");
  }, [img]);
  const mutation = useMutation(
    (newVideo) => {
      return makeRequest.post(`/videos/${currentUser._id}`, newVideo);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["random"]);
      },
    }
  );

  const hadleUpload = (e) => {
    e.preventDefault();

    const newVideo = {
      ...info,
      tags,
    };

    mutation.mutate(newVideo);

    setOpen(false);
  };

  return (
    <div className="upload">
      <div className="uploadWrapper">
        <div className="close" onClick={() => setOpen(false)}>
          X
        </div>
        <h1 className="uploadTitle">Upload A Video</h1>
        <label>Video:</label>
        {videoPerc > 0 ? (
          "Uploading:" + videoPerc + "%"
        ) : (
          <input
            type="file"
            className="uploadInput"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <input
          type="text"
          className="uploadInput"
          placeholder="Title"
          onChange={handleChange}
          id="title"
        />
        <textarea
          placeholder="Desc...."
          rows={10}
          onChange={handleChange}
          id="desc"
        ></textarea>
        <input
          type="text"
          className="uploadInput"
          placeholder="Seperate tags with Commas"
          onChange={handleTags}
          id="tags"
        />
        <label>Image:</label>
        {imgPrec > 0 ? (
          "Uploading:" + imgPrec + "%"
        ) : (
          <input
            type="file"
            className="uploadInput"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <button onClick={hadleUpload}>Save</button>
      </div>
    </div>
  );
}

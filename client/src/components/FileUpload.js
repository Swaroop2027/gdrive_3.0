import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  
  const handleSubmit = async (e) => { //storing and fetching file from ipfs
    e.preventDefault(); //not to reload all the data
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({ //helps to store files on ipfs using pinata
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`; //fetching image hash from ipfs
        // const signer = contract.connect(provider.getSigner());
        // signer.add(account, ImgHash);
        contract.add(account, ImgHash); //calling add function from smart contract
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
    alert("Successfully Image Uploaded");
    setFileName("No image selected");
    setFile(null);
  };

  const retrieveFile = (e) => { //fetching the data
    const data = e.target.files[0]; //files array of files object
    // console.log(data);
    const reader = new window.FileReader(); //reads file
    reader.readAsArrayBuffer(data); //reads file
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault(); //not to reload
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};
export default FileUpload;

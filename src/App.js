import { useState, useEffect } from "react";
import axios from 'axios';
import queryString from 'query-string';
import './App.css';

function App() {
  const [files, setFiles] = useState();

  const handleFiles = (e) => {
    if (e.target.files[0]) {
      const filesUp = e.target.files[0];
      setFiles(filesUp);
    }
  }

  const handleSubmit = async () => {
    const axiosClient = axios.create({
      paramsSerializer: params => queryString.stringify(params)
    });
    const res = await axiosClient.get(`http://localhost:5000/sign-s3?file-name=${files.name}&file-type=${files.type}`);
    console.log(res.data);
  }

  return (
    <div className="App">
      <input className='app-input' type="file" onChange={handleFiles}></input>
      <div className='app-btn-submit' onClick={handleSubmit}>Submit</div>
      <div className='app-img-wrap'>
        <img src='' alt='' className='app-img'></img>
      </div>
    </div>
  );
}

export default App;

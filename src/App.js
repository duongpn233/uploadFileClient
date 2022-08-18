import { useState, useEffect } from "react";
import axios from 'axios';
import queryString from 'query-string';
import { save } from 'save-file';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [urlImgs, setUrlImg] = useState([]);
  const [urlDowns, setUrlDown] = useState([]);
  const [listFile, setListFile] = useState([]);

  const handleFiles = (e) => {
    console.log(e.target.files)
    if (e.target.files[0]) {
      const filesUp = e.target.files;
      setFiles(filesUp);
    }
  }

  const handleSubmit = async () => {
    const axiosClient = axios.create({
      paramsSerializer: params => queryString.stringify(params)
    });
    console.log(files)
    let urls = [];
    let urlsDown = [];
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].type)
      const res = await axiosClient.get(`http://localhost:5000/sign-s3?file-name=${files[i].name}&file-type=${files[i].type}`);
      if (res.data) {
        const resUrl = await axiosClient.put(res.data, files[i], {
          headers: {
            'content-type': files[i].type,
            'mode': "cors",
            "Access-Control-Allow-Origin": "*",
            "Access-Allow-Control-Headers": "*",
            // "Access-Control-Request-Headers" : "Access-Control-Allow-Origin, Content-Type, Access-Control-Allow-Headers"
          }
        });
        const url = res.data.slice(0, res.data.indexOf('?'));
        console.log(url)
        if (files[i].type === "image/jpeg") {
          urls.push(url);
        }
        else {
          urlsDown.push(url);
        }
      }
    }
    setUrlImg([...urlImgs, ...urls]);
    setUrlDown([...urlDowns, ...urlsDown]);
    setFiles([]);
  };

  const handleDown = async (name) => {
    const axiosCl = axios.create();
    const res = await axiosCl.get(`http://localhost:5000/save-file?file-name=${name}`);
    await save(res.data.data.data, name);
    console.log(res.data.data.data);
  };

  const handleDele = async (name) => {
    const axiosCl = axios.create();
    const res = await axiosCl.get(`http://localhost:5000/delete-file?file-name=${name}`);
    console.log(res.data);
  }

  const getNameFile = (url) => {
    const name = url.slice(url.lastIndexOf('/') + 1, url.length);
    console.log(name)
    return name;
  }

  return (
    <div className="App">
      <input className='app-input' type="file" onChange={handleFiles} multiple></input>
      <div className='app-btn-submit' onClick={handleSubmit}>Submit</div>
      <div className='app-img-block'>
        {
          urlImgs.map((url, id) => {
            return (
              <div className='app-img-wrap' key={id}>
                <img src={url} alt='' className='app-img'></img>
                <div className="btn-wrap">
                  <div className="app-btn-down" onClick={() => handleDown(getNameFile(url))}>
                    {`download`}
                  </div>
                  <div className="app-btn-dele" onClick={() => handleDele(getNameFile(url))}>
                    {`delete`}
                  </div>
                </div>
                <br></br>
              </div>
            )
          })
        }
        {
          urlDowns.map((url, id) => {
            return (
              <div key={id}>
                <div className="btn-wrap">
                  <div className="app-btn-down" onClick={() => handleDown(getNameFile(url))}>
                    {`download`}
                  </div>
                  <div className="app-btn-dele" onClick={() => handleDele(getNameFile(url))}>
                    {`delete`}
                  </div>
                </div>
                <br></br>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;

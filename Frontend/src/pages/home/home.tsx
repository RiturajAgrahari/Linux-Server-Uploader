import { FormEvent, useRef, useState } from "react";
import api from "../../api";
import "../../styles/home.css"
import { Link } from "react-router-dom";

function Home() {

    const [serverFile, setServerFile] = useState<File>()
    const formref = useRef<HTMLFormElement>(null)
    const [fileName, setFileName] = useState<string>("")  //or drag it here
    const [fileUploaded, setFileUploaded] = useState<boolean>(false)
    const [uploadButton, setUploadButton] = useState<boolean>(false)


    const handleFileUpload = (e: EventTarget & HTMLInputElement) => {
        if (e.files) {
            setServerFile(e.files[0])
            setFileName(`${e.files[0].name}`)
            setFileUploaded(!fileUploaded)
        }
    }

    const handleUploadServer = async(e: FormEvent) => {
        e.preventDefault()
        formref.current?.reset();
        setUploadButton(!uploadButton)
        try {
            const res = await api.post("/api-data/upload-server/", {serverFile}, 
                {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                }
            )
            if (res.status == 200) {
                console.log(res)
            }
        } catch (error) {
            console.error("Fetching error", error)
        } finally {
            setUploadButton(!uploadButton)
        }
    } 


    return (
        <div className="home-component">
            <div className="upload-server">
                <h1>UPLOAD YOUR SERVER!</h1>
                <form ref={formref} className="box" method="post" action="" encType="multipart/form-data" onSubmit={handleUploadServer}>
                    <div className="box__input" onDrag={() => console.log(5)}>
                        <input className="box__file" type="file" name="file" id="file" onChange={(e) => handleFileUpload(e.target)} required/>
                        <label htmlFor="file">
                            {fileUploaded ? 
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/></svg>
                            :    
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                            }
                        <strong>Upload the Server</strong><span className="box__dragndrop">&nbsp; {fileName}</span></label>
                        <button className="box__button" type="submit">Upload</button>
                        <Link to={"/console"} className="link-button">Check Console</Link>
                    </div>
                        {/* <div className="box__uploading">Uploading…</div>
                        <div className="box__success">Done!</div>
                        <div className="box__error">Error! <span></span>.</div> */}
                </form>
            </div>
        </div>
    )
};

export default Home;
import { FormEvent, useRef, useState } from "react";
import api from "../../api";

function Home() {

    const [serverFile, setServerFile] = useState<File>()
    const formref = useRef<HTMLFormElement>(null)

    const handleFileUpload = (e: EventTarget & HTMLInputElement) => {
        if (e.files) {
            setServerFile(e.files[0])
            console.log(e.files)
        }
    }

    const handleUploadServer = async(e: FormEvent) => {
        e.preventDefault()
        formref.current?.reset();
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
        }
    } 


    return (
        <div>
            <h1>UPLOAD YOUR LINUX SERVER!</h1>
            <form ref={formref} onSubmit={handleUploadServer}>
                <input type="file" name="file" id="upload-file" onChange={(e) => handleFileUpload(e.target)} required/>
                <input type="submit" />
            </form>
        </div>
    )
};

export default Home;
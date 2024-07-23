import { useEffect, useRef, useState } from "react";
import "../../styles/outputConsole.css"
import api from "../../api";
import { Link } from "react-router-dom";
import macFolder from "../../static/macFolder.png"

function Output() {

    const [consoleResult, setConsoleResult] = useState<string>()
    const [resizeConsole, setResizeConsole] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string>("")

    // const mac = useRef<HTMLDivElement>(null)
    const scrollToMe = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const fetchOutput = async() => {
            try {
                const res = await api.get("/api-data/server-output/")
                if (res.status == 200) {
                    setConsoleResult(res.data.output)
                    setFileName(res.data.file_name)
                }
            } catch(error) {
                console.error("Error Fetching", error)
            } finally {
                setTimeout(() => {
                    scrollToMe.current?.scrollIntoView({behavior: "smooth"})
                }, 1000)
            }

        }
        fetchOutput();
    }, [])

    return (
        <div className="output-container">
            <div className="output-console" style={resizeConsole ? {width: "100%", height: "100%"} : {width: "80%", height: "80vh"}}>
                <div className="console-header">
                    <Link to={"/"} className="mac-red"></Link>
                    <p className="mac-yellow" onClick={() => setResizeConsole(!resizeConsole)} style={{cursor: "pointer"}}></p>
                    <p className="mac-green"></p>
                    <div className="mac-file">
                        <img src={macFolder} alt="mac folder" width={"20px"}/>
                        &nbsp; {fileName}
                    </div>
                </div>
                <div className="console-content">
                    {consoleResult}
                    <p ref={scrollToMe}></p>
                </div>
                <button onClick={() => scrollToMe.current?.scrollIntoView({behavior: "smooth", block: "end"})}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M440-800v487L216-537l-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg></button>
            </div>
        </div>
    )
}

export default Output;
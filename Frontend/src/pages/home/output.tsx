import { useEffect, useState } from "react";
import "../../styles/outputConsole.css"
import api from "../../api";

function Output() {

    const [consoleResult, setConsoleResult] = useState<string>()

    useEffect(() => {
        const fetchOutput = async() => {
            try {
                const res = await api.get("/api-data/server-output/")
                if (res.status == 200) {
                    setConsoleResult(res.data.output)
                }
            } catch(error) {
                console.error("Error Fetching", error)
            }

        }
        fetchOutput();
    }, [])


    return (
        <div className="output-container">
            <div className="output-console">
                <div className="console-header">
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
                <div className="console-content">
                    {consoleResult}
                </div>
            </div>
        </div>
    )
}

export default Output;
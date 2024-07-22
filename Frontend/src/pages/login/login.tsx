import { useState } from "react";
import "../../styles/login.css"
import { FormEvent } from "react";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

function Login() {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errorClass, setErrorClass] = useState("hide-error alert alert-danger alert-white rounded")
    const [errorMsg, setErrorMsg] = useState<string>("Changes has been saved successfully!")

    const navigate = useNavigate()

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/token/", {username, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            setErrorClass("hide-error alert alert-danger alert-white rounded")
            navigate("/")
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status == 401) {
                    handleError("invalid login credentials")
                } else {
                    console.error("error fetching", error)
                }
            } else {
                console.error("error fetching", error)
            }
        }
    }

    const handleError = (msg: string) => {
        setErrorMsg(msg)
        setErrorClass("alert alert-danger alert-white rounded")
    }

    return (
        <div className="login-component">
            <div className={errorClass}>
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true" onClick={() => setErrorClass(`hide-error ${errorClass}`)}>×</button>
                <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M833-41 435-440q-19 11-29 28.5T396-374q0 92 55.5 161T601-120q8 2 12 9.5t2 15.5q-2 8-9 12t-15 2q-108-28-171.5-107.5T356-374q0-28 13-52.5t37-41.5l-42-42q-34 26-52 61t-18 75q0 75 25.5 132T405-123q6 6 6 14.5T405-94q-6 6-14.5 6T376-94q-66-67-94-130.5T254-374q0-48 22-91.5t60-73.5l-44-43q-58 54-80 99t-22 109q0 36 6.5 73t20.5 72q3 8 0 15t-11 10q-8 3-15.5 0T180-215q-15-42-22-81t-7-78q0-73 25.5-127.5T264-611l-41-41q-20 17-36.5 34.5T156-580q-4 7-12 8.5t-16-3.5q-7-5-8-13t4-15q14-21 32-40t39-37L42-834l42-42L876-84l-43 43ZM688-354q-8 0-14-5.5t-6-14.5q0-72-51-121t-121-54l-40-40q6-1 12.5-1H481q93 0 160 62.5T708-374q0 9-5.5 14.5T688-354ZM481-879q64 0 125 15.5T724-819q9 5 10.5 12t-1.5 14q-3 7-10 11t-17-1q-53-27-109.5-41.5T481-839q-58 0-113.5 13T261-784l-29-29q57-32 120-49t129-17Zm0 98q106 0 200 45.5T838-604q7 9 4.5 16t-8.5 12q-6 5-14 4.5t-14-8.5q-55-78-141.5-119.5T481-741q-39 0-76.5 7T332-713l-30-30q42-19 86.5-28.5T481-781Zm0 94q135 0 232 90t97 223q0 29-13 52.5T763-282l-28-28q16-11 25.5-27.5T770-374q0-116-85-195t-203-79q-20 0-38.5 2.5T407-638l-32-32q25-8 51.5-12.5T481-687Zm193 525q-89 0-152.5-61T458-373q0-8 5.5-14t14.5-6q9 0 14.5 6t5.5 14q0 72 52 121t124 49q6 0 17-.5t23-2.5q9-2 15.5 2.5T738-190q2 8-3 14t-13 8q-18 5-31.5 5.5t-16.5.5Z"/></svg>
                </div>
                  <strong>Error!</strong> {errorMsg}
            </div>
            <form className="login-form" onSubmit={(e) => handleLogin(e)}>
                <h1>LOGIN</h1>
                <label>Username</label>
                <input type="text" placeholder="username" onChange={(e) => {setUsername(e.currentTarget.value)}} required/>
                <label>Password</label>
                <input type="password" placeholder="password" onChange={(e) => {setPassword(e.currentTarget.value)}} required/>
                <input type="submit" name="submitForm" id="submitForm" />
            </form>
        </div>
    )
}

export default Login;
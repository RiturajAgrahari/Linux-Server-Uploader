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

    const navigate = useNavigate()

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/token/", {username, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            navigate("/")
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status == 401) {
                    console.log("USER UNAUTHORIZED")
                } else {
                    console.error("error fetching", error)
                }
            } else {
                console.error("error fetching", error)
            }
        }
    }

    return (
        <div className="login-component">
            <form className="login-form" onSubmit={(e) => handleLogin(e)}>
                <h1>Login</h1>
                <label>Username</label>
                <input type="text" onChange={(e) => {setUsername(e.currentTarget.value)}}/>
                <label>Password</label>
                <input type="text" onChange={(e) => {setPassword(e.currentTarget.value)}}/>
                <input type="submit" name="submitForm" id="submitForm" />
            </form>
        </div>
    )
}

export default Login;
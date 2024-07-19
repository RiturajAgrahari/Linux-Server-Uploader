import { ReactNode, useEffect, useState } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { Link, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({children}: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])


    const refreshToken = async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh", {refresh: refreshToken,});
            if (res.status == 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch(error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }


    const auth = async() => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthorized(false)
            return
        }
        const decode: any = jwtDecode(token)
        const tokenExpiration = decode.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === false){
        return (
            <div style={{display:"flex", justifyContent: "center", alignItems:"center", flexDirection:"column", width:"100%", height: "80vh"}}>
                <h1>Your Session is Expired</h1>
                <p>Please Login again!</p>
                <Link to={"/login"} style={{border:"1px solid gray", textAlign: "center", textDecoration: "none", backgroundColor: "lightgray",color: "black", padding:"15px 40px", fontSize:"24px", width: "40%", margin: "20px"}}>Login</Link>
            </div>
        )
    }

    return isAuthorized ? children : <Navigate to="/login"/>

}

export default ProtectedRoute;
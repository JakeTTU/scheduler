import React, { useState, useRef } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import './LoginPage.css';
import logo from '../../assets/images/landing_logo.png';
import { SERVERHOST, SERVERPORT } from "../../ServerConnection.mjs";


const LoginPage = () => {
    
    const history = useNavigate();

    const [email, setEmail] = useState(false);
    const [password, setPassword] = useState(false);

    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    const getHash = (str, algo = "SHA-256") => {
        let strBuf = new TextEncoder().encode(str);
        return crypto.subtle.digest(algo, strBuf)
          .then(hash => {
            window.hash = hash;
            let result = '';
            const view = new DataView(hash);
            for (let i = 0; i < hash.byteLength; i += 4) {
              result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
            }
            return result;
          });
      }

    const api = axios.create({
        baseURL: `http://${SERVERHOST}:${SERVERPORT}`, 
    });

    async function submit(e){
        e.preventDefault();
        try{
            await api.post('/user/login',{
                email: email.toString().toLowerCase(),
                password: password.toString()
            })
            .then(res=>{
                if(res.data.valid){
                    history("/home", {auth: true, state:{auth: res.data.role, user_id:email}})
                }
                else if(res.data==="notexist"){
                    alert("Invalid Credentials")
                }
                setEmail(false); setPassword(false);
            })
            .catch(e=>{
                alert("Login Error")
                console.error(e);
                setEmail(false); setPassword(false)
            })
        }
        catch(e){
            console.log(e);
            setEmail(false); setPassword(false)
        }
        finally{
            emailRef.current.value = ""
            passwordRef.current.value = ""
        }
    }

    return (
        <div className="login-container">
            <div className="login">
            <img src={logo} alt="landing_logo" style={{width: '200px', height: '200px'}}></img>
                <h1>Login</h1>
                <form action="POST">
                    <input type="name" ref={emailRef} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email"  />
                    <input type="password" ref={passwordRef} onChange={(e) => { getHash(e.target.value).then(d=> {setPassword(d)})} } placeholder="Password"  />
                    <input type="submit" onClick={submit} />
                </form>
                <Link to="/contact">Contact</Link>
            </div>
        </div>
    )
}

export { LoginPage }
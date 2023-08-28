// eslint-disable-next-line
import React, { useEffect, useState } from "react"
// eslint-disable-next-line
import { useNavigate, Link } from "react-router-dom"


function Contact() {
    // const history=useNavigate();
    
    // eslint-disable-next-line
    const [email,setEmail]=useState('')
    // eslint-disable-next-line
    const [password,setPassword]=useState('')

    async function submit(e){
        e.preventDefault();

        alert('Thank you for contacting support')

    //     try{

    //         await axios.post("http://localhost:8000/signup",{
    //             email,password
    //         })
    //         .then(res=>{
    //             if(res.data=="exist"){
    //                 alert("User already exists")
    //             }
    //             else if(res.data=="notexist"){
    //                 history("/home",{state:{id:email}})
    //             }
    //         })
    //         .catch(e=>{
    //             alert("wrong details")
    //             console.log(e);
    //         })

    //     }
    //     catch(e){
    //         console.log(e);

    //     }

    // }
    }


    return (
        <div className="login">

            <h1>Contact</h1>

            <form action="POST">
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/">Login Page</Link>

        </div>
    )
}

export default Contact
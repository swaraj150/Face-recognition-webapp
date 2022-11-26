import { useContext } from "react";
import { useState } from "react";
// import {useNavigate} from "react-router-dom";
import TextContext from "../context/textContext";

function Login(props) {
    const context=useContext(TextContext);
    const {showalert}=context;
    const [cred, setcred] = useState({email:"",password:""});
    // let navigate=useNavigate();
    const onchange=(e)=>{
        setcred({...cred,[e.target.name]:e.target.value})
    }
    const handlesubmit=async(e)=>{
        e.preventDefault();
        const response=fetch("http://localhost:8000/api/create/login",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(cred)
        });
        const json=(await response).json();
        json.then((response)=>{
            if(response.success){
                localStorage.setItem("auth-token",response.authtoken);
                // navigate("/transactions")
                showalert("Logged in Succesfully","success");
            }
            else{
                showalert("Invalid Credentials","danger");
            }
        })
        window.onunload=()=>{
            localStorage.clear();
        }
    }
    return (
    <div>
        <div className="mx-3 my-3">
            <form onSubmit={handlesubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Email Address</label>
                    <input type={"email"} className="form-control" id="exampleFormControlTextarea1" name="email" onChange={onchange} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type={"password"} className="form-control" id="exampleInputPassword1" name="password" onChange={onchange} required/>
                </div>
               
                <button type="submit" className="btn btn-primary" onSubmit={handlesubmit}>Login</button>
            </form>
        </div>
    </div>
  )
}
export default Login
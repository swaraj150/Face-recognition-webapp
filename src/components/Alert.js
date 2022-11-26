import { useContext } from "react";
import TextContext from "../context/textContext";


function Alert(props) {
  const context=useContext(TextContext);
  const {alert}=context;
  const show=(word)=>{
      if(word==="danger"){
        word="error"
      }
      const lower=word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
  return (
    <div style={{height:"35px"}}>
        {alert && <div className={`alert alert-${alert.type} alert-dismissible fadeshow`} role='alert'>
            <strong>{show(alert.type)}</strong>: {alert.msg}
        </div>}
    </div>
  )
}
// Navbar.propTypes={title:PropTypes.string,aboutText:PropTypes.string}// just a precautionary check that title should be as string and not a number or an object

// import PropTypes from 'prop-types'

// Navbar.defaultProps={
//     title:"Set Title here",
//     aboutText: "About"
// }// if values are not entered use these default prop
export default Alert
import { useState } from "react";
import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom";


export function Login (props) {
    // states
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    // form client-side validation and login configuration
    const handleSubmit = (event) => {
        event.preventDefault();
        if ((username.replace(/\s+/g, '') === "" || password.replace(/\s+/g, '') === "")) {
            setErrorMsg("Errore! Username e password devono avere un valore valido.")
        } else {
            const credentials = {username, password};
            props.login(credentials)
            .then((user) => navigate("/users/" + user.id))
            .catch((err) => {
                setErrorMsg(err);
            });
        }
    }


    return (
        <div id="login-form-container">
            {/* Login header + subtext */}
            <img id="user-img" src="/user.png" />
            <h2 id="login-header">Bentornato</h2>
            <p id="login-message">Effettua il login per continuare</p>

            {/* Login form */}
            <form id="login-form" onSubmit={handleSubmit}>

                {/* Username input field */}
                <div className="input-container">
                    <img className="input-img" src="/input-user.png" />
                    <input className="login-input" type="text" value={username} placeholder="Username"
                           onChange={(event) => {setUsername(event.target.value)}} />
                </div>

                {/* Password input field */}
                <div className="input-container">
                    <img className="input-img" src="/input-password.png" />
                    <input className="login-input" type="password" value={password} placeholder="Password"
                           onChange={(event) => {setPassword(event.target.value)}} />
                </div>

                {/* Error message */}
                <p className="error-msg">{errorMsg}</p>
                {/* Submit button and back link */}
                <button type="submit" id="submit-button">Accedi</button>
                <Link id="back-link" to={"/"}>Indietro</Link>
            </form>
        </div>
    );
}

export default Login;
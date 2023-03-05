import { CircularProgress } from "@mui/material";
import { signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/authCOntext";
import { auth, provider } from "../../firebase";
import "./login.scss";

export default function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [info, setInfo] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [error, setError] = useState(null);
  const { login, loginGoogle, register } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleChangeR = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(inputs);
      navigate("/");
    } catch (error) {
      setError(error.response.data);
    }

    setLoading(false);
  };

  const handleGoogle = async (e) => {
    e.preventDefault();
    const google = await signInWithPopup(auth, provider);
    const info = {
      name: google.user.displayName,
      email: google.user.email,
      img: google.user.photoURL,
    };
    try {
      setLoading(true);
      await loginGoogle(info);
      navigate("/");
    } catch (error) {
      setError(error.response.data);
    }

    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      register(info);
      navigate("/");
    } catch (error) {
      setError(error.response.data);
    }

    setLoading(false);
  };

  return (
    <div className="login">
      <Menu />
      <div className="loginContainer">
        <Navbar />
        <div className="loginWrapper">
          <div className="siginWarpper">
            <h1>Sign in</h1>
            <h2>to continue to Metube</h2>
            <input
              type="text"
              placeholder="username"
              onChange={handleChange}
              name="email"
            />
            <input
              type="password"
              placeholder="password"
              onChange={handleChange}
              name="password"
            />
            <button onClick={handleLogin}>
              {loading ? <CircularProgress /> : "Sign in"}
            </button>
            <h1>or</h1>
            <button onClick={handleGoogle}>Sign in with Google</button>
            <h1>or</h1>
            <input
              type="text"
              placeholder="name"
              id="name"
              onChange={handleChangeR}
            />
            <input
              type="email"
              placeholder="email"
              id="email"
              onChange={handleChangeR}
            />
            <input
              type="password"
              placeholder="password"
              id="password"
              onChange={handleChangeR}
            />
            <button onClick={handleRegister}>Sign up</button>
          </div>
          <span>{error && error}</span>
          <div className="more">
            English(USA)
            <div className="links">
              <span>Help</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

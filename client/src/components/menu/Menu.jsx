import "./menu.scss";
import Logo from "../../icons/logo.png";
import Home from "../../icons/home.png";
import Explore from "../../icons/explore.png";
import Sport from "../../icons/football.png";
import Help from "../../icons/help.png";
import History from "../../icons/history.png";
import Library from "../../icons/library.png";
import Light from "../../icons/light.png";
import Live from "../../icons/live.png";
import Movie from "../../icons/movie.png";
import Music from "../../icons/music.png";
import News from "../../icons/news.png";
import Report from "../../icons/report.png";
import Settings from "../../icons/settings.png";
import Subcription from "../../icons/subcription.png";
import Dark from "../../icons/dark.png";
import Game from "../../icons/game.png";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkmode";
import { AccountCircleOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authCOntext";
export default function Menu() {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="menu">
      <div className="menuWrapper">
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="logo">
            <img src={Logo} alt="" />
            Metube
          </div>
        </Link>
        <hr />
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <div className="item">
            <img src={Home} alt="" />
            Home
          </div>
        </Link>
        <Link
          to={"/trends"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="item">
            <img src={Explore} alt="" />
            Explore
          </div>
        </Link>
        <Link
          to={"/subcriptions"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="item">
            <img src={Subcription} alt="" />
            Subcription
          </div>
        </Link>
        <hr />
        <div className="item">
          <img src={Library} alt="" />
          Library
        </div>
        <div className="item">
          <img src={History} alt="" />
          History
        </div>
        <hr />
        {!currentUser && (
          <>
            <div className="loginMenu">
              Sign in to like , comment, and subscribe
              <Link
                to={"/login"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <button>
                  <AccountCircleOutlined /> SIGN IN
                </button>
              </Link>
            </div>
            <hr />
          </>
        )}
        <div className="item">
          <img src={Music} alt="" />
          Music
        </div>
        <div className="item">
          <img src={Sport} alt="" />
          Sport
        </div>
        <div className="item">
          <img src={Game} alt="" />
          Gamming
        </div>
        <div className="item">
          <img src={Movie} alt="" />
          Movies
        </div>
        <div className="item">
          <img src={News} alt="" />
          News
        </div>
        <div className="item">
          <img src={Live} alt="" />
          Live
        </div>
        <hr />
        <div className="item">
          <img src={Settings} alt="" />
          Settings
        </div>
        <div className="item">
          <img src={Report} alt="" />
          Report
        </div>
        <div className="item">
          <img src={Help} alt="" />
          Help
        </div>
        {darkMode ? (
          <div className="item" onClick={toggle}>
            <img src={Light} alt="" />
            Light Mode
          </div>
        ) : (
          <div className="item" onClick={toggle}>
            <img src={Dark} alt="" />
            Dark Mode
          </div>
        )}
      </div>
    </div>
  );
}

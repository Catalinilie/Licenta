import React from "react";
import Routes from "./Routes";
import {Link, withRouter} from 'react-router-dom';
import "./main-page.css";
import "../css/bootstrap.min.css"
import "../css/bootstrap.css"


function App(props) {

    function handleLogout() {
        sessionStorage.clear();
        sessionStorage.setItem("isAuthenticated","false");
        props.history.push("/login");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                <a className="navbar-brand" href="/">Playing Fields</a>
                <button className="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarColor01"
                        aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item ">
                            <Link className="nav-link" to="/search">Search <span className="sr-only">(current)</span></Link>
                        </li>
                        {sessionStorage.getItem("isAuthenticated") === "true"
                            ? <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/addPlayingField">Add Field</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/myPlayingFields">My Playing Fields</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/myProfile">My Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                                </li>
                            </>
                            : <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        }
                    </ul>
                </div>
                </div>
            </nav>
            <Routes appProps={{}}/>
        </>
);
}

export default withRouter(App);
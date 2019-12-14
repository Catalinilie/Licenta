import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./App.css";
import Routes from "./Routes";
import {LinkContainer} from 'react-router-bootstrap'
import {Navbar} from "react-bootstrap";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";
import {withRouter} from "react-router";


function App(props) {
    const [isAuthenticated, userHasAuthenticated] = useState(false);

    function handleLogout() {
        userHasAuthenticated(false);
        props.history.push("/login");
    }

    return (
        <div className="App container">
            <Navbar fluid collapseOnSelect className="Navbar">
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Playing Fields</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight className="NavContainer">
                        <LinkContainer to="/search">
                            <NavItem>Search</NavItem>
                        </LinkContainer>
                        {isAuthenticated
                            ? <>
                                <LinkContainer to="/addPlayingField">
                                    <NavItem>Add Field</NavItem>
                                </LinkContainer>
                                <LinkContainer to="/myPlayingFields">
                                    <NavItem>My playing Fields</NavItem>
                                </LinkContainer>
                                <NavItem onClick={handleLogout}>Logout</NavItem>
                            </>
                            : <>
                                <LinkContainer to="/signup">
                                    <NavItem>Signup</NavItem>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <NavItem>Login</NavItem>
                                </LinkContainer>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Routes appProps={{isAuthenticated, userHasAuthenticated}}/>
        </div>
    );
}

export default withRouter(App);
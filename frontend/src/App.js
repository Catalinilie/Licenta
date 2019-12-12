import React from "react";
import {Link} from "react-router-dom";
import "./App.css";
import Routes from "./Routes";
import {LinkContainer} from 'react-router-bootstrap'
import {Navbar} from "react-bootstrap";
import Nav from "react-bootstrap/lib/Nav";
import NavItem from "react-bootstrap/lib/NavItem";

function App(props) {
    return (
        <div className="App container">
            <Navbar fluid collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Playing Fields</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <LinkContainer to="/search">
                            <NavItem>Search</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/signup">
                            <NavItem>SignUp</NavItem>
                        </LinkContainer>
                        <LinkContainer to="/login">
                            <NavItem>Login</NavItem>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Routes/>
        </div>
    );
}

export default App;
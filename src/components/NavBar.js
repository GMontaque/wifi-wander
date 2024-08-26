import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { CurrentUserContext } from '../App';


const NavBar = () => {

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <NavLink to="/">
                    <Navbar.Brand >
                        <img
                            src="your-logo-url-here.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Logo"
                        />
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink to="">Home</NavLink>
                        <NavLink to="/newlocation">Add Location</NavLink>
                        <NavLink to="/about">About Us</NavLink>
                    </Nav>
                    <Nav className="ms-auto">
                        <NavLink to="/signup">Sign Up</NavLink>
                        <NavLink to="/signin">Sign In</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;

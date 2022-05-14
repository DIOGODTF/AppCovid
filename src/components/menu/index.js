import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Menu extends Component {
    render() {
        return (
            <nav className="col-md-1 d-none d-md-block bg-light sidebar">
                <div className="sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link to={'/'} className="nav-link active">Principal</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/lista'} className="nav-link">Lista </Link>
                        </li>

                    </ul>
                </div>
            </nav>
        )
    }
}
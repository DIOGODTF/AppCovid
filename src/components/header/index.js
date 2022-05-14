import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-sm-3 col-md-1 mr-0" href="#">Agely</a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <span className="nav-link">Sair do Sistema</span>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Header;
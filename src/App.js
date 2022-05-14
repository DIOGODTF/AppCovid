import React from 'react';
import './App.css';
import Header from './components/header';
import Menu from './components/menu';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <div className="container-fluid">
          <div className="row">
            <Menu />
            <main role="main" className="col-md-12 col-lg-10">
              <br></br>
              <div className="row">
                <div className="col-sm-12">
                  <Routes />
                </div>  
              </div>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

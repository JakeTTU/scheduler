import  React from 'react';
import './App.css';
import { LoginPage } from './components/LoginPage/LoginPage.mjs';
import Contact from './components/Contact/Contact.mjs';
import Testing from './components_testing/TestPage/TestPage.mjs';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainPage from './components/MainPage/MainPage.mjs';
import { DataContextProvider } from './context/DataContext.mjs';
import { ComingSoonPage } from './components/ComingSoonPage/ComingSoonPage.mjs'

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/contact" element={<ComingSoonPage/>}/>
          <Route path="/home" element={ 
            <DataContextProvider>
              <MainPage/> 
            </DataContextProvider>
            }/>
          <Route path="/test" element={ 
            <DataContextProvider>
                <Testing/> 
            </DataContextProvider> 
            }/> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
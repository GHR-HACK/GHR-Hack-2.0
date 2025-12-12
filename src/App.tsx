import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apply.devfolio.co/v2/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="App">
      <div className="container">
        {/* Logo */}
        <div className="logo-section">
          <img src="/logo.png" alt="GHR Hack 2.0" className="logo" />
        </div>

        {/* Coming Soon */}
        <div className="coming-soon">
          <h1 className="title">GHR Hack 2.0</h1>
          <p className="subtitle">Coming Soon</p>
          <p className="description">Code to Career - Transform your coding skills into professional opportunities</p>
        </div>

        {/* Devfolio Partners Section */}
        <div className="partners-section">
          <h2>Our Partners</h2>
          <div className="partners-logos">
            <img
              src="/Devfolio.png"
              alt="DEVFOLIO LOGO"
              className="partner-logo devfolio-logo"
            />
            <img
              src="/ETHIndia.png"
              alt="ETHINDIA LOGO"
              className="partner-logo ethindia-logo"
            />
          </div>

          {/* Devfolio Apply Button */}
          <div
            className="apply-button"
            data-hackathon-slug="ghrhack2"
            data-button-theme="light"
            style={{ height: '44px', width: '312px' }}
          ></div>
        </div>
      </div>

    </div>
  );
}

export default App;

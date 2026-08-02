import "./Navbar.css";

function Navbar() {
return (
    <nav className="navbar">
        <div className="navbar-left">
        <div className="icon">
            ☰
        </div>

        <div className="logo">
            YouTube
        </div>
        </div>

        <div className="navbar-center">
        <input className="search-input" type="text" placeholder="Search"/>
        
        <button className="search-btn">
            Search
        </button>
        </div>

        <div className="navbar-right">
        <div className="icon">
            🔔
        </div>

        <div className="icon">
            👤
        </div>
        </div>
    </nav>
  );
}

export default Navbar;
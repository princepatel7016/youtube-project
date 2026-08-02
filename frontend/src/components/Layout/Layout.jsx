import Navbar from "../Navbar/Navbar.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";

function Layout({ children }) {
return (
    <>
    <Navbar />

    <div
        style={{
            display: "flex",
        }}
    >
        <Sidebar />

        <div
            style={{
            flex: 1,
            padding: "20px",
            }}
        >
            {children}
        </div>
    </div>
    </>
  );
}

export default Layout;
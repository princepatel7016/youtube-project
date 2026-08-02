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
            flex: 1,             //"Sidebar ke baad jitni bhi jagah bachi hai, wo mujhe de do."
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

// Navbar same rahega.
// Sidebar same rahega.
// Sirf children badlega (Home, About, Profile, VideoPage, etc.).
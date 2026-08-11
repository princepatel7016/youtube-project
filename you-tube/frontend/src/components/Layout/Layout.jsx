import React, { useState } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import UploadModal from "../UploadModal/UploadModal.jsx";

function Layout({ children, onSearch, onUploadSuccess }) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <>
            <Navbar
                onSearch={onSearch}
                onOpenUpload={() => setIsUploadOpen(true)}
            />

            <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
                <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

                <div
                    style={{
                        flex: 1,
                        padding: "20px",
                        backgroundColor: "#0f0f0f",
                        color: "#fff",
                        overflowY: "auto",
                    }}
                >
                    {children}
                </div>
            </div>

            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploadSuccess={onUploadSuccess}
            />
        </>
    );
}

export default Layout;
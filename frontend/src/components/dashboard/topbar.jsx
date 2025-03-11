import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",  // ✅ Ensures cookies are included
            });

            const data = await response.json();
            console.log("Logout Response:", data);

            if (response.ok) {
                // ✅ Delete cookie manually
                document.cookie = "auth_token=; Max-Age=0; path=/;";

                localStorage.removeItem("token"); // ✅ Remove local storage token
                navigate("/"); // ✅ Redirect to login page
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="bg-white shadow flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
                <FaSearch />
                <input type="text" placeholder="Search..." className="border rounded p-1" />
            </div>
            <div className="flex items-center gap-4">
                <FaBell />
                <FaUserCircle />
                <button onClick={handleLogout} className="text-red-500 flex items-center">
                    <FaSignOutAlt className="mr-1" /> Logout
                </button>
            </div>
        </div>
    );
};

export default TopBar;

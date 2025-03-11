import { FaUser, FaTasks, FaChartPie, FaBell, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold text-center mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-4">
          <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <FaUser /> Employees
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <FaTasks /> Tasks
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <FaChartPie /> Reports
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <FaBell /> Notifications
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
            <FaCog /> Settings
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

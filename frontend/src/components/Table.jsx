import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
function Table() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState({});
    const [departments, setDepartments] = useState({});
    const [designations, setDesignations] = useState({});

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
        fetchDesignations();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employees', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
                setFilteredEmployees(data);  // ✅ Update filteredEmployees initially
            } else {
                throw new Error('Failed to fetch employees');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchDepartments = async () => {
        
        try {
            const response = await fetch('http://localhost:5000/api/departments', { credentials: 'include' });
            const data = await response.json();
            const departmentsMap = {};
            data.forEach(dept => {
                departmentsMap[dept.id] = dept.name;
            });
            setDepartments(departmentsMap);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
      
    };

    const fetchDesignations = async () => {
        
        try {
            const response = await fetch('http://localhost:5000/api/designations', { credentials: 'include' });
            const data = await response.json();
            const designationMap = {};
            data.forEach(desi => {
                designationMap[desi.id] = desi.name;
            });
            setDesignations(designationMap);
        }
        catch (error) {
            console.log("Failed to fetch designations", error);
        }
        
    };
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };



    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsAdding(false);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedEmployee({});  // Clear any previous data
        setIsAdding(true);
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSearch = async () => {
        // if (searchQuery.trim() === "") {
        //     setFilteredEmployees(employees);  // ✅ Reset to full employee list if search is empty
        //     return;
        // }
        
        try {
            const response = await fetch(`http://localhost:5000/api/employees?search=${searchQuery}`, { credentials: "include" });
            const data = await response.json();
            setFilteredEmployees(data);
        } catch (error) {
            console.error("Error fetching searched employees:", error);
        }
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const formData = Object.fromEntries(form.entries());
    
        const url = isAdding ? 'http://localhost:5000/api/employees' : `http://localhost:5000/api/employees/${selectedEmployee.id}`;
        const method = isAdding ? 'POST' : 'PUT';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const result = await response.json();
            console.log(result);
            closeModal();
            fetchEmployees();
            setSearchQuery("");  // ✅ Reset search bar
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };
    const statuses = ["Active", "Inactive"];

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Filter
                    </button>
                    <div className="relative">
                        <svg className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M21 21l-6-6M3 6a9 9 0 0118 0 9 9 0 01-18 0z"></path>
                        </svg>
                        <input
                        type="text"
                        className="pl-10 pr-4 py-2 rounded bg-gray-100 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search for employees"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="bg-pink-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAddClick}
                    >
                        Add Employee
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">
                                Select
                            </th>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Name / Email</th>
                            <th scope="col" className="px-6 py-3">Phone Number</th>
                            <th scope="col" className="px-6 py-3">Department</th>
                            <th scope="col" className="px-6 py-3">Designation</th>
                            <th scope="col" className="px-6 py-3">Salary</th>
                            <th scope="col" className="px-6 py-3">Joining Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
    {filteredEmployees.map((employee) => (
        <tr key={employee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="w-4 p-4">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            </td>
            <td className="px-6 py-4">{employee.id}</td>
            <td className="px-6 py-4">
                <div className="text-gray-900 dark:text-white">{employee.name}</div>
                <div className="text-gray-500">{employee.email}</div>
            </td>
            <td className="px-6 py-4">{employee.phone}</td>
            {/* <td className="px-6 py-4">{departments[employee.departmentId] ?? "Unknown"}</td> */}
            <td className="px-6 py-4">{employee.department}</td>
            <td className="px-6 py-4">{employee.designation}</td>
            <td className="px-6 py-4">{employee.salary}</td>
            <td className="px-6 py-4">{employee.joiningDate}</td>
            <td className="px-6 py-4">
                <span className={
                    employee.status === "Active"
                        ? "bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs"
                        : "bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs"
                }>
                    {employee.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <button onClick={() => handleEditClick(employee)} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                    Edit
                </button>
            </td>
        </tr>
    ))}
</tbody>

                </table>
            </div>
            <EmployeeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                employee={selectedEmployee}
                isAdding={isAdding}
                departments={departments} // Assume these are fetched or static data
                designations={designations}
                statuses={statuses}
            />
        </div>
    );
}

export default Table;

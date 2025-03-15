import React, { useState, useEffect } from 'react';

function Table() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false); // State to track if we are adding a new employee
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                credentials: 'include'  // Make sure to include credentials if needed for cookies
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            } else {
                throw new Error('Failed to fetch employees');
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setIsAdding(false);
        setModalOpen(true);
    };

    const handleAddEmployeeClick = () => {
        // Reset selectedEmployee for new entries
        setSelectedEmployee({
            name: '',
            email: '',
            phone: '',
            department: '',
            designation: '',
            salary: '',
            joiningDate: '',
            status: 'Active', // Default status can be set as Active or any other default
            password: ''
        });
        setIsAdding(true);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Example department, designation, status options
    const departments = ["Marketing", "Sales", "Engineering", "Human Resources"];
    const designations = ["Manager", "Team Lead", "Engineer", "Specialist"];
    const statuses = ["Active", "Inactive", "Probation"];

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
                            onClick={() => console.log("Searching...")}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button 
                        className="bg-pink-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAddEmployeeClick}
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
                                <div className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                </div>
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
                        {employees.map(employee =>(
                            <tr key={employee.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="w-4 p-4">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            </td>
                            <td className="px-6 py-4">{employee.id}</td>
                            <td className="px-6 py-4">
                                <div className="text-gray-900 dark:text-white">{employee.name}</div>
                                <div className="text-gray-500">{employee.email}</div>
                            </td>
                            <td className="px-6 py-4">{employee.phone}</td>
                            <td className="px-6 py-4">{employee.departmentId}</td>
                            <td className="px-6 py-4">{employee.designationId}</td>
                            <td className="px-6 py-4">{employee.salary}</td>
                            <td className="px-6 py-4">{employee.joiningDate}</td>
                            <td className="px-6 py-4">
                                <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs">{employee.status}</span>
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                    Edit
                                </button>
                            </td>
                        </tr>
                        ))}
                        
                        
                        
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{isAdding ? "Add New Employee" : "Edit Employee"}</h3>
                            <form className="mt-2 px-7 py-3 space-y-4">
                                <input type="text" placeholder="Name" defaultValue={selectedEmployee.name} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"/>
                                <input type="text" placeholder="Email" defaultValue={selectedEmployee.email} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"/>
                                <input type="text" placeholder="Phone Number" defaultValue={selectedEmployee.phone} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"/>
                                <input type="password" placeholder="Password" defaultValue={selectedEmployee.password} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"/>
                                <select defaultValue={selectedEmployee.department} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full">
                                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                                <select defaultValue={selectedEmployee.designation} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full">
                                    {designations.map(design => <option key={design} value={design}>{design}</option>)}
                                </select>
                                <input type="text" placeholder="Salary" defaultValue={selectedEmployee.salary} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"/>
                                <input type="text" placeholder="Joining Date" defaultValue={selectedEmployee.joiningDate} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"/>
                                <select defaultValue={selectedEmployee.status} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full">
                                    {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" onClick={closeModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        {isAdding ? "Add" : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Table;

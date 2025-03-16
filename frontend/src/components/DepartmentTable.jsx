import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Department() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/departments', { withCredentials: true });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    // Open modal for add/edit
    const openModal = (item = null) => {
        setCurrentItem(item);
        setModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalOpen(false);
        setCurrentItem(null);
    };

    // Submit form data for create/update
    const handleSubmit = async (event) => {
        event.preventDefault();
        const name = event.target.elements.name.value;
        try {
            if (currentItem) {
                await axios.put(`http://localhost:5000/api/departments/${currentItem.id}`, { name }, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/api/departments', { name }, { withCredentials: true });
            }
            fetchDepartments();
            closeModal();
        } catch (error) {
            console.error('Error submitting department:', error);
        }
    };

    // Handle deletion of department
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/departments/${id}`, { withCredentials: true });
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Departments</h2>
                <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Department
                </button>
            </div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-2/3">Name</th>
                            <th scope="col" className="px-6 py-3 w-1/3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(department => (
                            <tr key={department.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 w-2/3">{department.name}</td>
                                <td className="px-6 py-4 w-1/3 flex space-x-2 justify-start">
                                    <button onClick={() => openModal(department)} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(department.id)} className="text-red-600 hover:text-red-900 cursor-pointer">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {modalOpen && (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-30 overflow-y-auto h-full w-full z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out">
        <div className="relative p-5 border rounded-md bg-white shadow-lg w-80"> {/* Adjusted opacity, shadow, and width */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{currentItem ? 'Edit Department' : 'Add Department'}</h3>
                <input
                    name="name"
                    type="text"
                    defaultValue={currentItem ? currentItem.name : ''}
                    placeholder="Enter department name"
                    required
                    className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full"
                />
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={closeModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
)}
        </div>
    );
}

export default Department;
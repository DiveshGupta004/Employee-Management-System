import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Designation() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch all designations
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/designations', { withCredentials: true });
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    };

    // Open modal to edit or add designation
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
                await axios.put(`http://localhost:5000/api/designations/${currentItem.id}`, { name }, { withCredentials: true });
            } else {
                await axios.post('http://localhost:5000/api/designations', { name }, { withCredentials: true });
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error('Error submitting designation:', error);
        }
    };

    // Handle deletion of designation
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/designations/${id}`, { withCredentials: true });
            fetchData();
        } catch (error) {
            console.error('Error deleting designation:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold">Designations</h2>
                <button onClick={() => openModal()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Designation
                </button>
            </div>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4 flex space-x-2 justify-start">
                                    <button onClick={() => openModal(item)} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 cursor-pointer">
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
                    <div className="relative p-5 border rounded-md bg-white shadow-lg w-80">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{currentItem ? 'Edit Designation' : 'Add Designation'}</h3>
                            <input
                                name="name"
                                type="text"
                                defaultValue={currentItem ? currentItem.name : ''}
                                placeholder="Enter designation name"
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

export default Designation;
import React from 'react';

function EmployeeModal({ isOpen, onClose, employee, isAdding, departments, designations, statuses, onSubmit }) {
    if (!isOpen) return null;
const today = new Date().toISOString().split('T')[0];
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{isAdding ? "Add New Employee" : "Edit Employee"}</h3>
                    <form className="mt-2 px-7 py-3 space-y-4" onSubmit={onSubmit}>
                        <input type="text" name="name" placeholder="Name" defaultValue={isAdding ? "" : employee.name} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full" />
                        <input type="text" name="email" placeholder="Email" defaultValue={isAdding ? "" : employee.email} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full" />
                        <input type="text" name="phone" placeholder="Phone Number" defaultValue={isAdding ? "" : employee.phone} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full" />
                        {/* Assuming password is not edited */}
                        {/* {isAdding && (
                            <input type="password" name="password" placeholder="Password" className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full" />
                        )} */}
                        <select name="departmentId" defaultValue={isAdding ? "default" : employee.departmentId} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full">
                            <option disabled value="default">Select Department</option>
                            {Object.entries(departments).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                        <select name="designationId" defaultValue={isAdding ? "default" : employee.designationId} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full">
    <option disabled value="default">Select Designation</option>
    {Object.entries(designations).map(([id, name]) => (
        <option key={id} value={id}>{name}</option>
    ))}
</select>

                        <input type="text" name="salary" placeholder="Salary" defaultValue={isAdding ? "" : employee.salary} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full" />
                        <input 
                            type="date" 
                            name="joiningDate" 
                            defaultValue={isAdding ? today : employee.joiningDate} 
                            className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full" 
                            required
                        />
                        <select name="status" defaultValue={isAdding ? "default" : employee.status} className="mb-3 px-4 py-2 border rounded-lg text-gray-700 w-full">
                            <option disabled value="default">Select Status</option>
                            {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={onClose} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
    );
}

export default EmployeeModal;

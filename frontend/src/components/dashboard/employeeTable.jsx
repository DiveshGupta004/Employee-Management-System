// const EmployeeTable = () => {
//     const employees = [
//       { id: 1, name: "John Doe", department: "IT", status: "Active" },
//       { id: 2, name: "Jane Smith", department: "HR", status: "Inactive" },
//     ];
  
//     return (
//       <div className="bg-white p-4 shadow rounded-lg">
//         <h2 className="text-lg font-bold mb-4">Employee List</h2>
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2">ID</th>
//               <th className="p-2">Name</th>
//               <th className="p-2">Department</th>
//               <th className="p-2">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {employees.map((emp) => (
//               <tr key={emp.id} className="border-t">
//                 <td className="p-2">{emp.id}</td>
//                 <td className="p-2">{emp.name}</td>
//                 <td className="p-2">{emp.department}</td>
//                 <td className="p-2">
//                   <span
//                     className={`px-2 py-1 rounded ${
//                       emp.status === "Active" ? "bg-green-300" : "bg-red-300"
//                     }`}
//                   >
//                     {emp.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   export default EmployeeTable;
  
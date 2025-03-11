import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", tasksCompleted: 5 },
  { month: "Feb", tasksCompleted: 10 },
  { month: "Mar", tasksCompleted: 8 },
];

const TaskChart = () => {
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Task Completion Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskChart;

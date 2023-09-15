import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function LineGraph({ pro, user }) {
  // Initialize data for all 12 months
  const allMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyData = allMonths.map((month) => ({
    monthYear: month,
    user: 0,
    pro: 0,
  }));

  // Fill in data from pro and user arrays
  pro?.forEach((user) => {
    const joinedDate = new Date(user.joinedOn);
    const month = joinedDate.toLocaleString('default', { month: 'short' });

    const monthData = monthlyData.find((data) => data.monthYear === month);
    if (monthData) {
      monthData.pro++;
    }
  });

  user?.forEach((user) => {
    const joinedDate = new Date(user.joinedOn);
    const month = joinedDate.toLocaleString('default', { month: 'short' });

    const monthData = monthlyData.find((data) => data.monthYear === month);
    if (monthData) {
      monthData.user++;
    }
  });

  const legendFormatter = (value, entry) => {
    // Customize the legend item with increased text size
    return <span style={{ fontSize: '16px', fontWeight:'700' }}>{value}</span>;
  };

  return (
    <div className="flex justify-center items-center mt-[8%] mb-5">
      <div className="w-[100%] sm:w-[75%]">
        <ResponsiveContainer aspect={2.3}>
          <LineChart width={500} height={300} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthYear" tick={{ fontSize: 16 }} />
            <YAxis tick={{ fontSize: 16 }} />
            <Tooltip />
            <Legend formatter={legendFormatter} />
            <Line type="monotone" dataKey="user" stroke="#8884d8" name="Users" activeDot={{ r: 8 }} strokeWidth={3} />
            <Line type="monotone" dataKey="pro" stroke="#82ca9d" name="Pros" activeDot={{ r: 8 }} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineGraph;

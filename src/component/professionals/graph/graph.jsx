import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph = ({orders}) => {
  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    return month;
  };

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = {};

  allMonths.forEach((month) => {
    monthlyData[month] = { completed: 0, cancelled: 0 };
  });

  orders.forEach((order) => {
    // console.log(order);
    const month = parseDate(order.date);
    if (monthlyData[month]) {
      if (order.work_status.status == "completed") {
        monthlyData[month].completed++;
      } else if (order.work_status.status == "cancelled") {
        monthlyData[month].cancelled++;
      }
    }
  });
  const data = allMonths.map((month) => ({
    month,
    completed: monthlyData[month].completed,
    cancelled: monthlyData[month].cancelled,
  }));

  // const data = [
  //   { month: "Jan", completed: 10, cancelled: 5 },
  //   { month: "Feb", completed: 20, cancelled: 8 },
  //   { month: "Mar", completed: 30, cancelled: 12 },
  //   { month: "Apr", completed: 15, cancelled: 6 },
  //   { month: "May", completed: 25, cancelled: 10 },
  //   { month: "Jun", completed: 18, cancelled: 7 },
  //   { month: "Jul", completed: 12, cancelled: 4 },
  //   { month: "Aug", completed: 23, cancelled: 9 },
  //   { month: "Sep", completed: 28, cancelled: 11 },
  //   { month: "Oct", completed: 22, cancelled: 8 },
  //   { month: "Nov", completed: 16, cancelled: 6 },
  //   { month: "Dec", completed: 14, cancelled: 5 },
  // ];
  
  return (
    <div className="flex justify-center items-center mt-[8%] mb-5">
      <div className="w-[100%] sm:w-[90%]">
        {" "}
        {/* Increased width */}
        <ResponsiveContainer aspect={2.3}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
            deviceBreakpoints={{ sm: 500 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#8884d8"
              barSize={25}
            />
            <Bar
              dataKey="cancelled"
              name="Cancelled"
              fill="#82ca9d"
              barSize={25}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graph;

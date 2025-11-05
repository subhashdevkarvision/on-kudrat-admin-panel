import { useEffect, useState } from "react";
import {
  // ArrowDownIcon,
  // ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Select from "../form/Select";
// import Badge from "../ui/badge/Badge";
import { axiosInstance } from "../../api";

export default function EcommerceMetrics() {
  const [selectedDuration, setSelectedDuration] = useState("today");
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const filterOptions = [
    { value: "today", label: "Today" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "this Month", label: "This Month" },
    { value: "till Now", label: "Till Now" },
  ];

  useEffect(() => {
    const fetchTotalOrderAndUser = async (selectedDuration: string) => {
      const { data } = await axiosInstance.get(
        `/stats?filter=${selectedDuration}`
      );
      if (data.success) {
        setOrders(data.data.totalOrders);
        setUsers(data.data.totalUsers);
      }
    };
    fetchTotalOrderAndUser(selectedDuration);
  }, [selectedDuration]);
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h4>Overview</h4>
        <div>
          <Select
            defaultValue={selectedDuration}
            options={filterOptions}
            onChange={(value) => setSelectedDuration(value)}
            className="w-10 rounded-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Users
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {users}
              </h4>
            </div>
            {/* <Badge color="success">
              <ArrowUpIcon />
              11.01%
            </Badge> */}
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Orders
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {orders}
              </h4>
            </div>

            {/* <Badge color="error">
              <ArrowDownIcon />
              9.05%
            </Badge> */}
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
      </div>
    </div>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

import { getDashboard } from "../api/dashboardApi";
import { getDoctors } from "../api/doctorsApi";
import { getPharmacies } from "../api/pharmaciesApi";

export default function Home() {
  const [stats, setStats] = useState([
    {
      title: "Total Users",
      value: 0,
      icon: "material-symbols:group-outline",
    },
    {
      title: "Total Doctors",
      value: 0,
      icon: "material-symbols:medical-services-outline",
    },
    {
      title: "Total Pharmacies",
      value: 0,
      icon: "material-symbols:local-pharmacy-outline",
    },
  ]);

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [medicineData, setMedicineData] = useState([]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDashboardData();
      hasFetched.current = true;
    }
  }, []);

  const fetchDashboardData = async () => {
    const toastId = toast.loading("Loading dashboard...");

    try {
      const [dashboardData, doctorData, pharmacyData] =
        await Promise.all([
          getDashboard(),
          getDoctors(),
          getPharmacies(),
        ]);

      setStats([
        {
          title: "Total Users",
          value: dashboardData.total_users || 0,
          icon: "material-symbols:group-outline",
        },
        {
          title: "Total Doctors",
          value: doctorData.doctors?.length || 0,
          icon: "material-symbols:medical-services-outline",
        },
        {
          title: "Total Pharmacies",
          value:
            pharmacyData.total_pharmacies ||
            pharmacyData.pharmacies?.length ||
            0,
          icon: "material-symbols:local-pharmacy-outline",
        },
      ]);

      const growthArray = Object.entries(
        dashboardData.monthly_user_growth || {}
      ).map(([month, value]) => ({
        month,
        value,
      }));

      setUserGrowthData(growthArray);

      const medicineArray = Object.entries(
        dashboardData.monthly_medicine_requests || {}
      ).map(([month, value]) => ({
        month,
        value,
      }));

      setMedicineData(medicineArray);

      toast.success("Dashboard loaded successfully 🎉", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard ❌", {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-10 md:space-y-10 px-3 sm:px-4 md:px-0">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 bg-primary-light p-4 sm:p-6 rounded-2xl border border-primary/30">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl p-5 sm:p-7 md:p-9 shadow-sm flex items-center justify-between border border-primary/30"
          >
            <div>
              <p className="text-base sm:text-lg md:text-xl text-primary font-semibold">
                {item.title}
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl text-primary font-semibold mt-2">
                {item.value}
              </h3>
            </div>

            <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon
                icon={item.icon}
                width="26"
                height="26"
                className="sm:w-8 sm:h-8 md:w-9 md:h-9"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-primary/30">
          <h3 className="text-primary font-semibold mb-4 text-base sm:text-lg ">
            User Growth
          </h3>

          <div className="h-56 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#DA722C"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-primary/30">
          <h3 className="text-primary font-semibold mb-4 text-base sm:text-lg">
            Monthly Added Medication
          </h3>

          <div className="h-56 sm:h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={medicineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#DA722C"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import DataTable from "../components/TableComp";
import StatsCom from "../components/StatsCom";
import SearchCom from "../components/SearchCom";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

import { getDoctors } from "../api/doctorsApi";

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const hasFetched = useRef(false);

  const itemsPerPage = 5; 

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDoctors();
      hasFetched.current = true;
    }
  }, []);

  const fetchDoctors = async () => {
    const toastId = toast.loading("Fetching doctors...");

    try {
      const result = await getDoctors();

      const formatted =
        result?.doctors?.map((doc) => ({
          name: doc?.name || "N/A",
          email: doc?.doctor_email || "N/A",
          specialization: doc?.specialization || "N/A",
          gender: doc?.sex || "N/A",
          hospital: doc?.hospital_name || "N/A",
        })) || [];

      setData(formatted);

      toast.success("Doctors loaded successfully ✅", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load doctors ❌", { id: toastId });
    }
  };

  // 🔍 Search + Filter
  const filteredData = data
    .filter((doctor) =>
      doctor?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((doctor) => (gender ? doctor.gender === gender : true));

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = filteredData.slice(startIndex, endIndex);

  // যদি filter/search change হয় → page 1 এ চলে যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [search, gender]);

  const columns = [
    { header: "Doctor name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Specialization", key: "specialization" },
    { header: "Gender", key: "gender" },
    { header: "Hospital", key: "hospital" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">

      <StatsCom
        title="Total Doctors"
        value={filteredData.length}
        icon="material-symbols:person-outline"
      />

      <SearchCom
        search={search}
        setSearch={setSearch}
        filterValue={gender}
        onFilterChange={setGender}
        filterOptions={[
          { label: "All", value: "" },
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        filterPlaceholder="Gender"
      />

      {/* Table */}
      <DataTable columns={columns} data={paginatedData} />

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

    </div>
  );
};

export default Doctors;
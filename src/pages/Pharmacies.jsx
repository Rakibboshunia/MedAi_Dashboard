import React, { useState, useRef, useEffect } from "react";
import DataTable from "../components/TableComp";
import StatsCom from "../components/StatsCom";
import SearchCom from "../components/SearchCom";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";

import { getPharmacies } from "../api/pharmaciesApi";

const Pharmacies = () => {
  const [search, setSearch] = useState("");
  const [websiteFilter, setWebsiteFilter] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const hasFetched = useRef(false);

  const itemsPerPage = 5; // প্রতি পেজে কয়টা দেখাবে

  useEffect(() => {
    if (!hasFetched.current) {
      fetchPharmacies();
      hasFetched.current = true;
    }
  }, []);

  const fetchPharmacies = async () => {
    const toastId = toast.loading("Fetching pharmacies...");

    try {
      const result = await getPharmacies();

      const formatted =
        result?.pharmacies?.map((item) => ({
          name: item?.pharmacy_name || "N/A",
          website: item?.website_link
            ? item.website_link.replace(/^https?:\/\//, "")
            : "",
          address: item?.Pharmacy_Address || "N/A",
        })) || [];

      setData(formatted);

      setTotal(
        result?.total_pharmacies ||
        result?.pharmacies?.length ||
        0
      );

      toast.success("Pharmacies loaded successfully ✅", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Failed to fetch pharmacies ❌", {
        id: toastId,
      });
    }
  };

  // 🔍 Search + Filter
  const filteredData = data
    .filter((pharmacy) =>
      pharmacy?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((pharmacy) => {
      if (!websiteFilter) return true;
      if (websiteFilter === "hasWebsite") return pharmacy.website;
      if (websiteFilter === "noWebsite") return !pharmacy.website;
      return true;
    });

  // 📄 Pagination Logic
  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = filteredData.slice(
    startIndex,
    endIndex
  );

  // search বা filter change হলে page reset হবে
  useEffect(() => {
    setCurrentPage(1);
  }, [search, websiteFilter]);

  const columns = [
    { header: "Pharmacy name", key: "name" },
    {
      header: "Website",
      key: "website",
      render: (url) =>
        url ? (
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-primary break-all"
          >
            {url}
          </a>
        ) : (
          "N/A"
        ),
    },
    { header: "Address", key: "address" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">

      <StatsCom
        title="Total Pharmacies"
        value={filteredData.length}
        icon="material-symbols:local-pharmacy-outline"
      />

      <SearchCom
        search={search}
        setSearch={setSearch}
        filterValue={websiteFilter}
        onFilterChange={setWebsiteFilter}
        filterOptions={[
          { label: "All", value: "" },
          { label: "Has Website", value: "hasWebsite" },
          { label: "No Website", value: "noWebsite" },
        ]}
        filterPlaceholder="Website"
      />

      <DataTable columns={columns} data={paginatedData} />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

    </div>
  );
};

export default Pharmacies;
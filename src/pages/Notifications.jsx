import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5; // প্রতি পেজে কয়টা দেখাবে

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/treatments/admin/system-notifications/"
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Notification fetch error:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(
    notifications.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedNotifications = notifications.slice(
    startIndex,
    endIndex
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axiosInstance.delete(
        `/treatments/admin/system-notifications/${id}/`
      );

      const updated = notifications.filter(
        (item) => item.id !== id
      );

      setNotifications(updated);

      // যদি delete করার পর page empty হয়ে যায়
      if (
        updated.length > 0 &&
        startIndex >= updated.length
      ) {
        setCurrentPage((prev) => prev - 1);
      }

      toast.success("Notification deleted ✅");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete notification ❌");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-10">
      <div className="bg-white rounded-2xl shadow-sm p-5 md:p-8 relative">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-text-main">
              Notification
            </h3>
            <p className="text-sm text-text-muted">
              Total {notifications.length} Notifications
            </p>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-text-muted">
            Loading notifications...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
              {notifications.length === 0 && (
                <p className="text-sm text-text-muted">
                  No notifications found.
                </p>
              )}

              {paginatedNotifications.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start
                  bg-primary-light/30 hover:bg-primary-light/50
                  px-4 md:px-5 py-3 rounded-lg transition-all border border-gray-300"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-main">
                      {item.title}
                    </p>
                    <p className="text-sm text-text-main">
                      {item.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </span>

                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      {deletingId === item.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Pagination Component */}
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) =>
                setCurrentPage(page)
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
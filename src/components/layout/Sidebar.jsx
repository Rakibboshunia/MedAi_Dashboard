import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const navLinks = [
    {
      name: "Dashboards",
      path: "/",
      icon: "material-symbols:dashboard-outline",
    },
    { 
      name: "Users", 
      path: "/users", 
      icon: "material-symbols:group-outline" 
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: "material-symbols:medication-outline",
    },
    {
      name: "Pharmacies",
      path: "/pharmacies",
      icon: "material-symbols:local-pharmacy-outline",
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: "material-symbols:notifications-outline-rounded",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    if (window.innerWidth < 768) {
      onClose?.();
    }

    navigate("/login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-sidebar-border
        transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex justify-center py-8 px-8">
            <Link to="/" className="flex justify-center cursor-pointer">
              <img
                src="/logo.png"
                alt="Mad AI Logo"
                className="h-10 w-10 scale-[2.5] hover:opacity-90 transition"
              />
            </Link>
          </div>

          <div className="h-1 bg-sidebar-border mx-6 mb-6" />

          {/* Nav */}
          <nav className="flex-1 space-y-3 overflow-y-auto px-4">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-4 text-lg font-semibold transition-all
                  ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-primary hover:bg-primary-light hover:text-primary"
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) onClose?.();
                }}
              >
                <Icon icon={item.icon} width="22" height="22" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4">
            <div className="h-0.5 bg-sidebar-border" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-4
              text-lg font-semibold text-primary transition-all
              hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              <Icon
                icon="material-symbols:logout-rounded"
                width="22"
                height="22"
              />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

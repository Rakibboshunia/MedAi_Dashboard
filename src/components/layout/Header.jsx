import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import FormInput from "../../components/FormInput";
import PasswordInput from "../../components/PasswordInput";
import ConfirmModal from "../../components/ConfirmModal";

import {
  getAdminProfileApi,
  updateAdminProfileApi,
  changeAdminPasswordApi,
} from "../../api/profileApi";

export default function Header({ onMenuClick }) {
  const location = useLocation();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openSection, setOpenSection] = useState("info");

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
    profile_picture: "",
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  /* ================= RESPONSIVE TITLE ================= */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getTitle = (path) => {
    switch (path) {
      case "/":
        return isMobile ? "Dashboard" : "Dashboard Overview";
      case "/users":
        return isMobile ? "Users" : "Users Management";
      case "/doctors":
        return isMobile ? "Doctors" : "Doctors Management";
      case "/pharmacies":
        return isMobile ? "Pharmacies" : "Pharmacies Management";
      case "/notifications":
        return isMobile ? "Notifications" : "Notifications Management";
      default: {
        const cleanPath = path.split("/").filter(Boolean)[0];
        return cleanPath
          ? cleanPath.charAt(0).toUpperCase() +
              cleanPath.slice(1).replace("-", " ")
          : "Dashboard";
      }
    }
  };

  const title = getTitle(location.pathname);

  /* ================= FETCH PROFILE ================= */
  const fetchProfile = async () => {
    try {
      const data = await getAdminProfileApi();
      setProfileData((prev) => ({
        ...prev,
        full_name: data?.full_name || "",
        email: data?.email || "",
        profile_picture: data?.profile_picture || "",
      }));
    } catch {
      toast.error("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setProfileData((prev) => ({
      ...prev,
      profile_picture: previewUrl,
    }));
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      if (!profileData.full_name.trim()) {
        toast.error("Full name is required");
        return;
      }

      if (!profileData.email.trim()) {
        toast.error("Email is required");
        return;
      }

      if (profileData.new_password) {
        if (!profileData.old_password) {
          toast.error("Current password is required");
          return;
        }
        if (profileData.new_password !== profileData.confirm_password) {
          toast.error("Passwords do not match");
          return;
        }
      }

      setIsSaving(true);
      const toastId = toast.loading("Updating profile...");

      const formData = new FormData();
      formData.append("full_name", profileData.full_name);
      formData.append("email", profileData.email);

      if (selectedImageFile) {
        formData.append("profile_picture", selectedImageFile);
      }

      const updatedProfile = await updateAdminProfileApi(formData);

      setProfileData((prev) => ({
        ...prev,
        profile_picture: updatedProfile?.profile_picture,
      }));

      if (profileData.new_password) {
        await changeAdminPasswordApi({
          old_password: profileData.old_password,
          new_password: profileData.new_password,
          confirm_password: profileData.confirm_password,
        });
      }

      toast.success("Profile updated successfully 🎉", { id: toastId });

      setShowConfirmModal(false);
      setShowProfileModal(false);

      setProfileData((prev) => ({
        ...prev,
        old_password: "",
        new_password: "",
        confirm_password: "",
      }));

      setSelectedImageFile(null);
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-24 w-full items-center justify-between bg-transparent px-8 text-text-main">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="rounded-md p-2 hover:bg-primary-light text-primary md:hidden"
          >
            <Icon icon="material-symbols:menu-rounded" width="28" />
          </button>

          <h1
            className={`font-bold text-primary truncate ${
              isMobile ? "text-lg max-w-50" : "text-4xl"
            }`}
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/notifications">
            <button className="relative cursor-pointer rounded-full p-2.5 bg-primary-light text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/30">
              <Icon
                icon="material-symbols:notifications-outline-rounded"
                width="30"
              />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => setShowProfileModal((prev) => !prev)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="h-16 w-16 rounded-full overflow-hidden border-3 border-primary shadow-md">
                <img
                  src={
                    profileData.profile_picture ||
                    "https://randomuser.me/api/portraits/men/32.jpg"
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <Icon
                icon="material-symbols:keyboard-arrow-down-rounded"
                width="32"
                className={`transition-transform duration-300 ${
                  showProfileModal ? "rotate-180" : ""
                }`}
              />
            </div>

            {showProfileModal && (
              <div className="absolute right-0 mt-4 w-105 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-50 max-h-[85vh] overflow-y-auto">
                <div className="relative h-24 bg-primary">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="absolute top-5 right-5 bg-white/20 text-white p-2 scale-[1.3] hover:scale-[1.5] transition-all rounded-full cursor-pointer"
                  >
                    ✕
                  </button>

                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                    <div className="relative">
                      <div className="w-30 h-30 rounded-full border-4 border-white overflow-hidden shadow-lg">
                        <img
                          src={
                            profileData.profile_picture ||
                            "https://randomuser.me/api/portraits/men/32.jpg"
                          }
                          className="w-full h-full object-cover"
                          alt="Avatar"
                        />
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 bg-white p-2 rounded-xl shadow"
                      >
                        <Icon icon="lucide:camera" width="16" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-20 p-8 bg-gray-50 space-y-6">

                  {/* BASIC INFO */}
                  <div className="bg-white rounded-2xl shadow border border-gray-300 overflow-hidden">
                    <button
                      onClick={() =>
                        setOpenSection(openSection === "info" ? "" : "info")
                      }
                      className="w-full flex justify-between items-center px-6 py-4 font-bold text-primary "
                    >
                      Basic Information
                      <Icon
                        icon="material-symbols:expand-more-rounded"
                        width="26"
                        className={`transition-transform ${
                          openSection === "info" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openSection === "info" && (
                      <div className="px-6 pb-6 space-y-4">
                        <FormInput
                          label="Full Name"
                          value={profileData.full_name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              full_name: e.target.value,
                            })
                          }
                        />

                        <FormInput
                          label="Email Address"
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="bg-white rounded-2xl shadow border border-gray-300 overflow-hidden">
                    <button
                      onClick={() =>
                        setOpenSection(
                          openSection === "password" ? "" : "password"
                        )
                      }
                      className="w-full flex justify-between items-center px-6 py-4 font-bold text-primary"
                    >
                      Change Password
                      <Icon
                        icon="material-symbols:expand-more-rounded"
                        width="26"
                        className={`transition-transform ${
                          openSection === "password" ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openSection === "password" && (
                      <div className="px-6 pb-6 space-y-4">
                        <PasswordInput
                          label="Current Password"
                          value={profileData.old_password}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              old_password: e.target.value,
                            })
                          }
                        />

                        <PasswordInput
                          label="New Password"
                          value={profileData.new_password}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              new_password: e.target.value,
                            })
                          }
                          showStrength
                        />

                        <PasswordInput
                          label="Confirm Password"
                          value={profileData.confirm_password}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              confirm_password: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-2xl font-bold shadow-lg transition-all cursor-pointer"
                  >
                    Update Profile
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showConfirmModal && (
        <ConfirmModal
          title="Save Changes?"
          description="Your profile information will be updated."
          onConfirm={handleSave}
          onCancel={() => setShowConfirmModal(false)}
          loading={isSaving}
        />
      )}
    </>
  );
}
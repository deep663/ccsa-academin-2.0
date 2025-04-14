import { useEffect, useState } from "react";
import {
  FaUserCheck,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaUserTimes,
} from "react-icons/fa";
import { deleteUser, getUsers, verifyUser } from "../../utils/api";
import InlineLoader from "../InlineLoader";
import ConfirmationToast from "../ConfirmationToast";
import AddUsers from "./AddUsers";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [toast, setToast] = useState("");
  const [showAdd, setShowAdd] = useState (false);


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setShowToast(false);
    if (!selectedUserId) return;

    try {
      setLoading(true);
      await verifyUser(selectedUserId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUserId ? user.isVerified ? user.isVerified = false: user.isVerified = true : user
        )
      );
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setLoading(false);
      setSelectedUserId(null);
      fetchUsers();
    }
  };

  const handleAdd = async () => {
    setShowAdd((prev) => !prev)
  }

  const handleDelete = async () => {
    setShowToast(false);
    if (!selectedUserId) return;

    try {
      setLoading(true);
      await deleteUser(selectedUserId);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUserId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setSelectedUserId(null);
      // window.location.reload();
    }
  };

  // Filter & Sort Users
  const filteredUsers = users
    ?.filter(
      (user) =>
        user?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(search?.toLowerCase())
    )
    ?.filter((user) =>
      filterRole === "all" ? true : user?.role === filterRole
    )
    ?.sort((a, b) => {
      if (sortOrder === "asc") return a[sortKey] > b[sortKey] ? 1 : -1;
      return a[sortKey] < b[sortKey] ? 1 : -1;
    });

  // Pagination Logic
  const totalFilteredUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalFilteredUsers / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (loading) return <InlineLoader />;

  if (showToast && toast === "verify")
    return (
      <ConfirmationToast
        title="Verify User"
        message="Are you sure you want to verify this user?"
        confirmText="Verify"
        cancelText="Cancel"
        onConfirm={handleVerify}
        onCancel={() => setShowToast(false)}
        onClose={() => setShowToast(false)}
      />
    );

  if (showToast && toast === "delete")
    return (
      <ConfirmationToast
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowToast(false)}
        onClose={() => setShowToast(false)}
      />
    );

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-[#192f59] mb-4">Manage Users</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="px-4 py-2 bg-[#30834d] text-white rounded"
        >
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>

      {/* Total Count Display */}
      <div className="text-gray-700 font-medium mb-2">
        Showing {totalFilteredUsers}{" "}
        {totalFilteredUsers === 1 ? "user" : "users"}
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse border">
        <thead className="bg-[#192f59] text-white">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, idx) => (
            <tr key={idx} className="hover:bg-gray-100">
              <td className="border p-2">{user?.name}</td>
              <td className="border p-2">{user?.email}</td>
              <td className="border p-2">{user?.role}</td>
              <td className="border p-2 flex items-center justify-center gap-2">
                {!user?.verified && (
                  <button
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setToast("verify");
                      setShowToast(true);
                    }}
                    className={`px-3 py-1 ${
                      user?.isVerified ? "bg-[#30834d]" : "bg-red-600"
                    } text-white rounded flex items-center gap-2`}
                  >
                    {user?.isVerified ? (
                      <>
                        <FaUserCheck /> Verified
                      </>
                    ) : (
                      <>
                        <FaUserTimes /> Unverified
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setToast("delete");
                    setShowToast(true);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#192f59] text-white"
          }`}
        >
          <FaChevronLeft /> Previous
        </button>

        <span className="text-[#192f59] font-semibold">
          Page {totalFilteredUsers === 0 ? 0 : currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalFilteredUsers === 0}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            currentPage === totalPages || totalFilteredUsers === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#192f59] text-white"
          }`}
        >
          Next <FaChevronRight />
        </button>
      </div>

      {/* Add User Button */}
      <button onClick={() => handleAdd()} className="mt-4 bg-[#30834d] text-white px-4 py-2 rounded cursor-pointer">
        Add New User
      </button>

      {showAdd && <AddUsers onClose={()=>setShowAdd(false)}/>}
    </div>
  );
};

export default ManageUsers;

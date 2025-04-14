
const AdminDashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#4f90d1] p-4 rounded-lg">
          <h3>Total Users</h3>
          <p>150</p>
        </div>
        <div className="bg-[#4f90d1] p-4 rounded-lg">
          <h3>Pending Notes Approval</h3>
          <p>5</p>
        </div>
        <div className="bg-[#4f90d1] p-4 rounded-lg">
          <h3>Total Uploaded Notes</h3>
          <p>200</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
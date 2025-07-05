// AdminApproval.jsx

import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils";

function AdminApproval() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWithAuth("/admin/pending");
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userID) => {
    setProcessing((prev) => ({ ...prev, [userID]: true }));
    try {
      await fetchWithAuth(`/admin/approve/${userID}`, { method: "POST" });
      setUsers((prev) => prev.filter((user) => user.userID !== userID));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing((prev) => ({ ...prev, [userID]: false }));
    }
  };

  const handleRejection = async (userID) => {
    setProcessing((prev) => ({ ...prev, [userID]: true }));
    try {
      await fetchWithAuth(`/admin/reject/${userID}`, { method: "POST" });
      setUsers((prev) => prev.filter((user) => user.userID !== userID));
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing((prev) => ({ ...prev, [userID]: false }));
    }
  };

  if (loading) return <p className="text-center text-gray-700 dark:text-gray-200">جارٍ التحميل...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">طلبات الموافقة</h2>

      {users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">لا توجد طلبات معلقة.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center rounded overflow-hidden">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
              <tr>
                <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">الاسم</th>
                <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">الدور</th>
                <th className="py-2 px-4 border border-gray-300 dark:border-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-200">
              {users.map((user) => (
                <tr key={user.userID} className="border-b border-gray-300 dark:border-gray-600">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleApproval(user.userID)}
                        disabled={processing[user.userID]}
                        className={`px-3 py-1.5 rounded-md text-white bg-green-600 hover:bg-green-700 transition text-sm ${
                          processing[user.userID] ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {processing[user.userID] ? "جارٍ القبول..." : "قبول"}
                      </button>
                      <button
                        onClick={() => handleRejection(user.userID)}
                        disabled={processing[user.userID]}
                        className={`px-3 py-1.5 rounded-md text-white bg-red-600 hover:bg-red-700 transition text-sm ${
                          processing[user.userID] ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {processing[user.userID] ? "جارٍ الرفض..." : "رفض"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminApproval;

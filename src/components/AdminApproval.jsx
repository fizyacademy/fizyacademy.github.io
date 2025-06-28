import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils"; // ✅ تأكد إن المسار صحيح حسب مشروعك

function AdminApproval() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState({}); // Keyed by user.userID

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
            await fetchWithAuth(`/admin/approve/${userID}`, {
                method: "POST",
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user.userID !== userID));
        } catch (err) {
            alert(err.message);
        } finally {
            setProcessing((prev) => ({ ...prev, [userID]: false }));
        }
    };

    const handleRejection = async (userID) => {
        setProcessing((prev) => ({ ...prev, [userID]: true }));
        try {
            await fetchWithAuth(`/admin/reject/${userID}`, {
                method: "POST",
            });
            setUsers((prevUsers) => prevUsers.filter((user) => user.userID !== userID));
        } catch (err) {
            alert(err.message);
        } finally {
            setProcessing((prev) => ({ ...prev, [userID]: false }));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-gray-50 text-gray-700 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Users Awaiting Approval</h2>
            {users.length === 0 ? (
                <p>No pending approvals.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Username</th>
                            <th className="border p-2">Role</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userID} className="text-center">
                                <td className="border p-2">{user.username}</td>
                                <td className="border p-2 capitalize">{user.role}</td>
                                <td className="border p-2 flex justify-center gap-2">
                                    <button
                                        className={`bg-green-500 text-white px-3 py-1 rounded ${
                                            processing[user.userID] ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onClick={() => handleApproval(user.userID)}
                                        disabled={processing[user.userID]}
                                    >
                                        {processing[user.userID] ? "Approving..." : "Approve"}
                                    </button>
                                    <button
                                        className={`bg-red-500 text-white px-3 py-1 rounded ${
                                            processing[user.userID] ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onClick={() => handleRejection(user.userID)}
                                        disabled={processing[user.userID]}
                                    >
                                        {processing[user.userID] ? "Rejecting..." : "Reject"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminApproval;

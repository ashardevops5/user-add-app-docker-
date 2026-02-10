import { useState, useEffect } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const API_URL = "http://54.87.19.100:5000"; // Backend public IP

  // Fetch current users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAdd = async () => {
    if (!name || !email) {
      setMessage("Name and Email required!");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`User added successfully!`);
        setName("");
        setEmail("");
        fetchUsers(); // refresh table
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Request failed: " + err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/delete-user/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`User deleted!`);
        fetchUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      setMessage("Request failed: " + err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f8",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#34495e" }}>Add User</h1>

      {message && (
        <div
          style={{
            background: "#2ecc71",
            color: "#fff",
            padding: 10,
            marginBottom: 15,
            borderRadius: 5,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          style={{
            padding: "10px 20px",
            background: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
          onClick={handleAdd}
        >
          Submit
        </button>
      </div>

      <h2 style={{ color: "#34495e" }}>Users List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ddd", padding: 8 }}>Name</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: 8 }}>Email</th>
            <th style={{ borderBottom: "2px solid #ddd", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ background: "#fff", marginBottom: 5 }}>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{u.email}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                <button
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: 3,
                    cursor: "pointer",
                  }}
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: 10 }}>
                No users yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingUser, setEditingUser] = useState(null);

// API URL construida con variables de entorno Vite
const API_URL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}/users`;

  const getUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { fullname, email, phone };

    try {
      if (editingUser) {
        await fetch(`${API_URL}/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        setEditingUser(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
      }

      setFullname("");
      setEmail("");
      setPhone("");
      getUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleEdit = (user) => {
    setFullname(user.fullname);
    setEmail(user.email);
    setPhone(user.phone);
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      getUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>Gestión de Usuarios</h1>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Número telefónico"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingUser ? "Actualizar" : "Registrar"}
          </button>
        </form>

        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-users">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.fullname}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(u)} className="btn btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="btn btn-delete">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

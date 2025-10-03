import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, ArrowUpDown } from "lucide-react";

export default function UserList({ users = [], setUsers }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  const [asc, setAsc] = useState(true);
  const perPage = 6;

  useEffect(() => {
    if (users.length) return setLoading(false);
    (async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        setUsers(await res.json());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [users, setUsers]);

  const showToast = (msg, duration = 2000) => {
    setToast(msg);
    setTimeout(() => setToast(""), duration);
  };

  const removeUser = (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast(`User "${name}" deleted!`);
  };

  const { shown, total } = useMemo(() => {
    const filtered = users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    const totalPages = Math.ceil(filtered.length / perPage);
    const shownUsers = filtered.slice((page - 1) * perPage, page * perPage);
    return { shown: shownUsers, total: totalPages };
  }, [users, search, asc, page]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-6">
      {toast && (
        <div className="fixed top-20 right-5 bg-green-700 text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search..."
          className="flex-1 p-3 border rounded bg-black text-white"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setAsc(!asc)}
            className="px-4 py-2 bg-gray-700 text-white rounded flex items-center gap-1">
            <ArrowUpDown size={16} /> {asc ? "A-Z" : "Z-A"}
          </button>
          <Link
            to="/add"
            className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-1">
            <Plus size={16} /> New
          </Link>
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="text-center text-gray-400">No users.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((u) => (
            <div
              key={u.id}
              className="bg-black text-white p-5 rounded relative">
              <Link to={`/user/${u.id}`}>
                <h2>{u.name}</h2>
                <p className="text-gray-300">{u.email}</p>
                <p className="text-gray-400">{u.company?.name || "—"}</p>
              </Link>
              <button
                onClick={() => removeUser(u.id, u.name)}
                className="absolute top-2 right-2 p-2 bg-red-600 rounded-full">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
      {total > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-black text-white rounded">
            Prev
          </button>
          <span className="px-4 py-2">
            {page} / {total}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(total, p + 1))}
            disabled={page === total}
            className="px-4 py-2 bg-black text-white rounded">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

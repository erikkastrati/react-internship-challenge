import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function UserDetails({ users }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const textStyle = "text-sm font-medium tracking-widest uppercase";

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const localUser = users.find((u) => u.id === +id);
      if (localUser) {
        setUser(localUser);
      } else {
        try {
          const res = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          const data = await res.json();
          setUser(Object.keys(data).length ? data : null);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [id, users]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-300 animate-pulse">
          Fetching user data for you...
        </p>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <p className="text-red-400 font-semibold">Sorry!</p>
        <p className="text-gray-300">No user found with this ID.</p>
        <Link
          to="/"
          className={`mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition ${textStyle}`}>
          Back to user list
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-black text-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      {[
        ["Email", user.email],
        ["Phone", user.phone],
        [
          "Website",
          <a
            key="website"
            href={`http://${user.website}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline">
            {user.website}
          </a>,
        ],
        ["Company", user.company?.name],
        [
          "Address",
          user.address ? `${user.address.street}, ${user.address.city}` : "N/A",
        ],
      ].map(([label, value]) => (
        <p key={label} className={`mb-2 ${textStyle}`}>
          <span className="font-semibold"> {label}:</span> {value}
        </p>
      ))}
      <div className="flex justify-between mt-6">
        <Link
          to="/"
          className={`px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition ${textStyle}`}>
          Back to user list
        </Link>
        <Link
          to={`/edit/${user.id}`}
          className={`px-4 py-2 bg-white hover:bg-gray-200 rounded text-black font-semibold transition ${textStyle}`}>
          Update
        </Link>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateUser({ users, setUsers }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    company: "",
    addressStreet: "",
    addressCity: "",
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const foundUser = users.find((u) => u.id === parseInt(id));
    if (foundUser) {
      setUserData({
        name: foundUser.name || "",
        email: foundUser.email || "",
        phone: foundUser.phone || "",
        website: foundUser.website || "",
        company: foundUser.company?.name || "",
        addressStreet: foundUser.address?.street || "",
        addressCity: foundUser.address?.city || "",
      });
    }
    setLoading(false);
  }, [id, users]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUsers = users.map((u) =>
      u.id === parseInt(id)
        ? {
            ...u,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            website: userData.website,
            company: { ...u.company, name: userData.company },
            address: {
              ...u.address,
              street: userData.addressStreet,
              city: userData.addressCity,
            },
          }
        : u
    );

    setUsers(updatedUsers);
    setToast("User updated successfully!");
    setTimeout(() => {
      setToast("");
      navigate(`/user/${id}`);
    }, 1500);
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-black text-white p-6 rounded-lg shadow relative">
      {toast && (
        <div className="fixed top-20 right-5 bg-green-700 text-white px-4 py-2 rounded shadow-lg">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { name: "name", type: "text", placeholder: "Name" },
          { name: "email", type: "email", placeholder: "Email" },
          { name: "phone", type: "text", placeholder: "Phone" },
          { name: "website", type: "text", placeholder: "Website" },
          { name: "company", type: "text", placeholder: "Company" },
          { name: "addressStreet", type: "text", placeholder: "Street" },
          { name: "addressCity", type: "text", placeholder: "City" },
        ].map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            value={userData[field.name]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="p-3 border border-gray-700 rounded bg-black text-white"
            required={["name", "email"].includes(field.name)}
          />
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-white hover:bg-gray-200 rounded text-black font-semibold transition">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\-() ]{5,20}$/.test(val),
      "Invalid phone number"
    ),
  website: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/.test(val),
      "Invalid website URL"
    ),
  company: z
    .string()
    .min(2, "Company must be at least 2 characters")
    .optional(),
  addressStreet: z
    .string()
    .min(2, "Street must be at least 2 characters")
    .optional(),
  addressCity: z
    .string()
    .min(2, "City must be at least 2 characters")
    .optional(),
});

export default function UpdateUser({ users, setUsers }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  const foundUser = users.find((u) => u.id === parseInt(id));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      company: "",
      addressStreet: "",
      addressCity: "",
    },
  });

  useEffect(() => {
    if (foundUser) {
      setValue("name", foundUser.name || "");
      setValue("email", foundUser.email || "");
      setValue("phone", foundUser.phone || "");
      setValue("website", foundUser.website || "");
      setValue("company", foundUser.company?.name || "");
      setValue("addressStreet", foundUser.address?.street || "");
      setValue("addressCity", foundUser.address?.city || "");
    }
  }, [foundUser, setValue]);

  const onSubmit = (data) => {
    const updatedUsers = users.map((u) =>
      u.id === parseInt(id)
        ? {
            ...u,
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone?.trim() || "",
            website: data.website?.trim() || "",
            company: { ...u.company, name: data.company?.trim() || "" },
            address: {
              ...u.address,
              street: data.addressStreet?.trim() || "",
              city: data.addressCity?.trim() || "",
            },
          }
        : u
    );

    setUsers(updatedUsers);
    setToast(`User "${data.name}" updated successfully!`);

    setTimeout(() => {
      setToast("");
      navigate(`/user/${id}`);
    }, 1200);
  };

  const textStyle = "text-sm font-medium tracking-widest uppercase";

  if (!foundUser) return <p className="text-center mt-6">User not found.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-black text-white p-6 rounded-lg shadow relative">
      {toast && (
        <div className="fixed top-20 right-5 bg-green-700 text-white px-4 py-2 rounded shadow-lg transition-all">
          {toast}
        </div>
      )}

      <h1 className={`text-3xl font-bold mb-6 ${textStyle}`}>Update User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {[
          { name: "name", placeholder: "Full Name", type: "text" },
          { name: "email", placeholder: "Email Address", type: "email" },
          { name: "phone", placeholder: "Phone Number", type: "text" },
          {
            name: "website",
            placeholder: "Website (example.com)",
            type: "text",
          },
          { name: "company", placeholder: "Company Name", type: "text" },
          { name: "addressStreet", placeholder: "Street", type: "text" },
          { name: "addressCity", placeholder: "City", type: "text" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <input
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
              className={`p-3 border border-gray-700 rounded bg-black text-white ${textStyle}`}
            />
            {errors[field.name] && (
              <span className="text-red-500 text-xs mt-1">
                {errors[field.name]?.message}
              </span>
            )}
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className={`px-4 py-2 bg-white hover:bg-gray-200 rounded text-black font-semibold transition ${textStyle}`}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white transition ${textStyle}`}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

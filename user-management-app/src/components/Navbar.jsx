import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Users" },
    { to: "/add", label: "Add User" },
  ];
  const linkStyle =
    "transition duration-200 hover:text-gray-400 text-sm font-medium tracking-widest uppercase";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md shadow-sm text-white px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/" className="text-2xl md:text-3xl font-extrabold">
          UserApp
        </Link>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className="hidden md:flex gap-8 ml-8">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={linkStyle}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {open && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 px-2 pb-4">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className={linkStyle}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

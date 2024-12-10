import { Link } from "react-router-dom";

const removeTrailingSlash = (path) =>
  path.endsWith("/") ? path.slice(0, -1) : path;

const NavLink = ({ to, location, label }) => {
  const normalizedTo = removeTrailingSlash(to);
  const currentPath = removeTrailingSlash(location.pathname);

  return (
    <Link
      to={normalizedTo === currentPath ? "" : normalizedTo}
      className={`text-base w-full border-2 border-white flex-1 rounded-2xl font-medium px-2 text-[10px] py-[4px] text-center transition-all duration-200 decoration-transparent
        ${
          currentPath === normalizedTo
            ? "text-[#320000] bg-white"
            : "hover:text-white text-white"
        }`}
    >
      {label}
    </Link>
  );
};

export default NavLink;

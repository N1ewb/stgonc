import { useNavigate } from "react-router-dom";

export default function MobileNavigationLinks({
  link,
  activeLink,
  setActiveLink,
}) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    setActiveLink(link.name);
    navigate(link.link);
  };
  return (
    <div
      onClick={handleNavigate}
      className={`text-[#360000] bg-white rounded-full flex justify-center items-center text-center ${
        activeLink === link.name
          ? "w-[100px] h-[100px] absolute -top-[20%] border-solid border-5 border-[#360000]"
          : "w-[50px] h-[50px] relative top-[35%]"
      }`}
    >
      {link.name}
    </div>
  );
}

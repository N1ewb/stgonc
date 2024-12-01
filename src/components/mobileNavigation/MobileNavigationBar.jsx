import MobileNavigationLinks from "./MobileNavigationLinks";

export default function MobileNavigationBar({
  Links,
  activeLink,
  setActiveLink,
}) {
  return (
    <div className="bg-[#360000] h-[200px] w-full flex flex-wrap gap-5 justify-center p-3 relative">
      {Links &&
        Links.map((link) => {
          return (
            <MobileNavigationLinks
              key={link.name}
              link={link}
              activeLink={activeLink}
              setActiveLink={setActiveLink}
            />
          );
        })}
    </div>
  );
}

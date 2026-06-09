import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import brain from "@/assets/cerebro.png";
import homeIcon from "@/assets/layout/home.png";
import homeBlueIcon from "@/assets/layout/home-blue.png";
import chatIcon from "@/assets/layout/chat.png";
import chatBlueIcon from "@/assets/layout/chat-blue.png";
import profileIcon from "@/assets/layout/profile.png";
import profileBlueIcon from "@/assets/layout/profile-blue.png";
import logoutIcon from "@/assets/layout/logout.png";
import dataIcon from "@/assets/layout/data.png";
import dataBlueIcon from "@/assets/layout/data-blue.png";
import partner2 from "@/assets/partner-2-white.png";

function Item({ to, imgSrc, label }) {
  return (
    <NavLink
      to={to}
      className="group flex flex-col items-center justify-center gap-1.5 text-center text-[11px] leading-tight select-none cursor-pointer"
    >
      {({ isActive }) => {
        const iconBase =
          "grid place-items-center h-11 w-11 rounded-[40%] transition-all duration-200";
        const iconState = isActive
          ? "bg-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.2)]"
          : "bg-transparent";
        const iconHover =
          "group-hover:bg-white/20 active:scale-95";

        return (
          <>
            <span className={`${iconBase} ${iconState} ${iconHover}`}>
              <img
                src={imgSrc}
                alt=""
                className="h-5 w-5 object-contain transition-all duration-200 opacity-85 group-hover:opacity-100 [filter:brightness(0)_invert(1)]"
                draggable={false}
              />
            </span>
            <span className="text-white/85 group-hover:text-white">
              {label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}

function MobileNav() {
  const { session } = useAuth();

  const items = [
    { to: "/courses", icon: homeIcon, iconBlue: homeBlueIcon, label: "Inicio" },
    { to: "/chat", icon: chatIcon, iconBlue: chatBlueIcon, label: "Chat Nia" },
    { to: "/profile", icon: profileIcon, iconBlue: profileBlueIcon, label: "Mi perfil" },
  ];

  if (session?.user?.role === "ADMIN") {
    items.push({ to: "/admin", icon: dataIcon, iconBlue: dataBlueIcon, label: "Datos" });
  }

  return (
    <nav
      className="
        lg:hidden
        fixed left-1/2 -translate-x-1/2 bottom-3
        z-[70]
        w-[92%] max-w-[520px]
        rounded-[22px] bg-white
        ring-1 ring-[#1D4789]/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]
      "
      aria-label="Navegación principal"
    >
      <ul className="flex flex-nowrap justify-between gap-2">
        {items.map(({ to, icon, iconBlue, label }) => (
          <li key={to} className="flex-1 flex justify-center">
            <NavLink
              to={to}
              className="group flex flex-col items-center gap-1.5 text-[11px] leading-tight select-none"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "grid place-items-center h-11 w-11 rounded-[40%] transition-all duration-200 active:scale-95",
                      isActive
                        ? "bg-[#1D4789] shadow-[0_4px_14px_rgba(29,71,137,0.4)]"
                        : "bg-white",
                    ].join(" ")}
                  >
                    <img
                      src={isActive ? icon : iconBlue}
                      alt=""
                      className="h-5 w-5 object-contain transition-all duration-200"
                      style={isActive ? { filter: "brightness(0) invert(1)" } : {}}
                      draggable={false}
                    />
                  </span>
                  <span
                    className={[
                      "transition-colors font-medium",
                      isActive ? "text-[#1D4789]" : "text-[#555]",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function DashboardLayout() {
  const { logout, session } = useAuth();
  const location = useLocation();
  const isExperience = location.pathname === "/experience";

  return (
    <div className="min-h-screen text-white">
      <aside
        className={[
          "fixed left-0 top-0 z-40 hidden h-screen w-24 flex-col items-center bg-[#1D4789] p-3",
          isExperience ? "xl:flex" : "lg:flex",
        ].join(" ")}
      >
        <Link
          to="/courses"
          aria-label="Ir a cursos"
          className="mt-3 rounded-[40%] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <img
            src={brain}
            alt="Cerebro"
            className="h-10 w-10 object-contain cursor-pointer transition-transform hover:scale-105 active:scale-95"
            draggable={false}
          />
        </Link>

        <nav className="mt-12 flex w-full flex-col items-stretch gap-4">
          <Item to="/courses" imgSrc={homeIcon} label="Inicio" />
          <Item to="/chat" imgSrc={chatIcon} label="Chat Nia" />
          {session?.user?.role === "ADMIN" && (
            <Item to="/admin" imgSrc={dataIcon} label="Datos" />
          )}
        </nav>

        <div className="mt-auto w-full" />
        <div className="mb-2 w-full">
          <Item to="/profile" imgSrc={profileIcon} label="Mi perfil" />
        </div>

        <button
          onClick={logout}
          className="mb-2 flex w-full flex-col items-center justify-center gap-1.5 text-[11px] text-white/85 transition group cursor-pointer"
          title="Salir"
        >
          <span className="grid place-items-center h-11 w-11 rounded-[40%] bg-transparent transition-all duration-200 group-hover:bg-white/20 active:scale-95">
            <img
              src={logoutIcon}
              alt=""
              className="h-5 w-5 object-contain transition-all duration-200 opacity-85 group-hover:opacity-100 [filter:brightness(0)_invert(1)]"
              draggable={false}
            />
          </span>
          <span className="group-hover:text-white">Salir</span>
        </button>
      </aside>

      {!isExperience && <MobileNav />}

      <main
        className={[
          "min-h-screen",
          isExperience
            ? "p-0 xl:pl-24 xl:px-10 xl:py-8"
            : "px-5 py-6 lg:pl-24 lg:px-10 lg:py-8 pb-28 lg:pb-8",
        ].join(" ")}
      >
        <div
          className={[
            "w-full",
            isExperience
              ? "max-w-none px-0 xl:mx-auto xl:max-w-[1600px]"
              : "mx-auto max-w-[1600px] px-2 sm:px-4 lg:px-0",
          ].join(" ")}
        >
          <div
            className={[
              "mb-6 items-center justify-between gap-4",
              isExperience ? "hidden xl:flex" : "flex",
            ].join(" ")}
          >
            <h1 className="text-2xl font-medium text-[#1D4789]">
              Hola,{" "}
              {session?.user?.fullName ||
                "Usuario"}
            </h1>
            <div className="flex items-center gap-8">
             
              <img
                src={partner2}
                alt="Partner 2"
                className="shrink-0 h-14 sm:h-16 lg:h-[88px] max-h-[88px] object-contain drop-shadow-md"
                draggable={false}
              />
            </div>
          </div>

          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  );
}

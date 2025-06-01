"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  InfoIcon,
  TableIcon,
  UserCircleIcon,
  VideoIcon
} from "../icons/index";
// import { IoIosListBox } from "react-icons/io";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { VscExtensions } from "react-icons/vsc";

import { TbCube } from "react-icons/tb"; // perfect square cube shape

import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon/>,
    name: "Dashboard",
    subItems: [{ name: "Dashboard", path: "/", pro: false }],
  },
 
  // {
  //   icon: <VideoIcon />,
  //   name: "Add Movies",
  //   path: "/calendar",
  // },
  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
   {
    name: "Movies",
    icon: <VideoIcon />,
    subItems: [{ name: "Movies List", path: "/basic-videos", pro: false },
    { name: "Movies Status", path: "/reject-videos", pro: false },
    { name: "Add Movies", path: "/addMovies", pro: false }],
    // { name: "Movies Category", path: "/category", pro: false }],
    
  },
  {
    name: "Web-Series",
    icon: <CalenderIcon />,
    subItems: [
      { name: "List of Series", path: "/getlistofseries", pro: false },
      { name: "Add Series", path: "/upload", pro: false },
      { name: "Add Season", path: "/season", pro: false },
      { name: "Add Episode", path: "/episode", pro: false },
    ],
  },
  {
    // icon: <HiOutlineSquaresPlus />,
    icon: <HiOutlineSquaresPlus size={20} style={{ marginLeft: '4px' }} />,
    name: "Upcoming Banners",
    subItems: [{ name: "Upcoming Banners", path: "/upcoming-banners", pro: false }],
  },
  {
    // icon: <HiOutlineSquaresPlus />,
    icon: <TbCube size={20} style={{ marginLeft: '4px' }} />,
    name: "Add Casts",
    subItems: [{ name: "Casts", path: "/casts", pro: false }],
  },
  {
    name: "Tv-shows",
    icon: <TableIcon />,
    subItems: [
      { name: "List Tvs-show", path: "/listoftvshows", pro: false },
      { name: "Add TV-Show", path: "/uploadtvshow", pro: false },
      { name: "Add Season", path: "/uploadtvshowSeason", pro: false },
      { name: "Add Episode", path: "/uploadtvshowEpisode", pro: false },
    ],
  },
  {
    icon: <GridIcon/>,
    name: "Contest",
    subItems: [
      { name: "Contest", path: "/contests", pro: false },
      { name: "LeaderBoard", path: "/LeaderBoard", pro: false }
    ],
  },
 
  // {
  //   name: "Shorts",
  //   icon: <BsReverseLayoutTextWindowReverse size={20} style={{ marginLeft: '4px' }} />,
  //   subItems: [
  //     { name: "Add Shorts", path: "/uploadtvshow", pro: false },
  //   ],
  // },
  {
    name: "Transactions",
    icon: <VscExtensions size={20} style={{ marginLeft: '4px' }}/>,
    subItems: [
      { name: "Informations", path: "/transactionsall", pro: false },
      { name: "History", path: "/transactionsHistory", pro: false },

    ],
  },
  // {
  //   name: "Contest",
  //   icon: <TableIcon />,
  //   subItems: [
  //     { name: "Add Shorts", path: "/uploadtvshow", pro: false },
  //   ],
  // },
 
  {
    icon: <InfoIcon  />,
    name: "Packages",
    path: "/profile",
  },
   
  {
    icon: <UserCircleIcon  />,
    name: "Edit Profile",
    path: "/edit-profile",
  },

  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* <div
  className={`py-8 flex ${
    !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
  }`}
>
  <Link href="/">
    <span className="flex items-center  text-2xl font-bold text-black dark:text-white transition-colors">
      <Image
        className="hidden dark:block"
        src="/images/logo/logo21.svg"
        alt="Logo"
        width={24}
        height={24}
      />
     <Image
                className="dark:hidden"
                src="/images/logo/logo21.svg"
                alt="Logo"
                width={60}
                height={20}
              />
      GutargooPlus
    </span>
  </Link>
</div> */}
<div
  className={`py-8 flex ${
    !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
  }`}
>
  <Link href="/">
    <span className="flex items-center text-2xl font-bold text-black dark:text-white transition-colors">
      {/* Logo image */}
      <Image
        className="hidden dark:block"
        src="/images/logo/logo21.svg"
        alt="Logo"
        width={24}
        height={24}
      />
      <Image
        className="dark:hidden"
        src="/images/logo/logo21.svg"
        alt="Logo"
        width={60}
        height={20}
      />
      
      {/* Conditionally render the text only if sidebar is expanded */}
      {(isExpanded || isHovered) && (
        <span className="ml-2">GutargooPlus</span>
      )}
    </span>
  </Link>
</div>

      {/* <div
  className={`py-8 flex ${
    !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
  }`}
>
  <Link href="/">
    <span
      className="text-2xl font-bold text-black dark:text-white transition-colors"
    >
      GutargooPlus
    </span>
  </Link>
</div> */}

      {/* <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo21.svg"
                alt="Logo"
                width={100}
                height={10}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo21.svg"
                alt="Logo"
                width={100}
                height={10}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo21.svg"
              alt="Logo"
              width={100}
              height={10}
            />
          )}
        </Link>
      </div> */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;

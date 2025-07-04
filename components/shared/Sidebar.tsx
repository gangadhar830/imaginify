"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  return (  
    <aside className="hidden w-72 bg-white p-5 shadow-md shadow-purple-200/50 lg:flex">
      <div className="flex flex-col gap-4 size-full">
        <Link href="/" className="flex items-center gap-2 py-2">
          <Image
            src="/assets/images/logo-text.svg"
            alt={"logo"}
            width={180}
            height={28}
          />
        </Link>
        <nav className="h-full flex-col justify-between md:flex md:gap-4">
          <SignedIn>
            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              {navLinks.slice(0,6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`flex items-center gap-2 p-4 font-semibold w-full whitespace-nowrap rounded-full bg-cover transition-all hover:bg-purple-300 hover:shadow-inner ${
                      isActive ? "bg-purple-400 text-black" : "text-gray-700"
                    }`}
                  >
                    <Link
                      href={`${link.route}`}
                      className="flex items-center gap-2 w-full"
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive ? "brightness-75" : ""}`}
                      />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
              </ul>
              <ul className="hidden w-full flex-col  mt-20 gap-2 md:flex">
                  {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;
                return (
                  <li
                    key={link.route}
                    className={`flex items-center gap-2 p-4 font-semibold w-full whitespace-nowrap rounded-full bg-cover transition-all hover:bg-purple-300 hover:shadow-inner ${
                      isActive ? "bg-purple-400 text-black" : "text-gray-700"
                    }`}
                  >
                    <Link
                      href={`${link.route}`}
                      className="flex items-center gap-2 w-full"
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive ? "brightness-75" : ""}`}
                      />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li className="flex-center cursor-pointer gap-2 p-4 font-bold w-full">
              <UserButton afterSignOutUrl="/sign-in" showName/>
              </li>
            </ul>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href='/sign-in'>Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

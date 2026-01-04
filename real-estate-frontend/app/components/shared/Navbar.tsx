"use client";
import AuthNav from "@/app/auth/auth-nav";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="w-full bg-white shadow-lg z-50 sticky top-0">
      <div className="w-full sm:w-[95%] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between ">
        <Link href={"/"} className="flex items-center space-x-1 ">
          <span className="font-bold text-lg sm:text-2xl pb-1">🏠</span>
          <h1 className="text-lg sm:text-2xl text-green-600 font-semibold">
            Housify
          </h1>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-2 ">
          <li className="">
            <Link
              href={"/"}
              className="text-black rounded-md hover:bg-green-500 hover:text-white transition font-medium py-2 px-4"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              href={"/listing"}
              className="text-black rounded-md hover:bg-green-500 hover:text-white transition font-medium py-2 px-4"
            >
              Listings
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
              className="text-black rounded-md hover:bg-green-500 hover:text-white transition font-medium py-2 px-4"
            >
              Contacts Us
            </Link>
          </li>
        </ul>

        <div className="flex items-center justify-center gap-2">
          <AuthNav />

          <div
            onClick={() => setIsOpen(true)}
            className="md:hidden cursor-pointer text-black hover:bg-green-500 hover:text-white py-1 px-2 rounded-lg "
          >
            <Menu className="h-5 w-5" />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow py-4  transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden z-50`}
        >
          <div className="flex justify-end pb-1 pr-10  shadow cursor-pointer">
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer hover:bg-green-500 hover:text-white p-1 rounded-lg"
            >
              <X />
            </button>
          </div>

          <ul className="flex flex-col px-4 py-6 space-y-6 ">
            <li className="" onClick={() => setIsOpen(false)}>
              <Link
                href={"/"}
                className="text-black rounded-md hover:bg-green-500 hover:text-white transition font-medium py-2 px-4"
              >
                Home
              </Link>
            </li>

            <li onClick={() => setIsOpen(false)}>
              <Link
                href={"/listing"}
                className="text-black rounded-md hover:bg-green-500 hover:text-white transition font-medium py-2 px-4"
              >
                Listings
              </Link>
            </li>
            <li onClick={() => setIsOpen(false)}>
              <Link
                href={"/contact"}
                className="text-black rounded-md hover:bg-green-500 hover:text-white transition font-medium py-2 px-4"
              >
                Contacts Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

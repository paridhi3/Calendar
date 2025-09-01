//components/Header.js
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "./LoginModal";

function Header() {
  const { data: session } = useSession();
  const [profileClick, setProfileClick] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (profileClick === true) {
      const timeout = setTimeout(() => {
        setProfileClick(false);
      }, 6000);

      return () => clearTimeout(timeout); // cleanup
    }
  }, [profileClick]);

  return (
    <header className="bg-white sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <Image src="/images/logo.png" alt="logo" width={50} height={50} />
          <span className="text-2xl font-black text-gray-800">Calendar</span>
        </Link>

        {/* Desktop Auth / Profile */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {session?.user ? (
            <>
              <Image
                src={session.user.image}
                alt="user"
                width={40}
                height={40}
                onClick={() => setProfileClick(!profileClick)}
                className="rounded-full cursor-pointer hover:border-[2px] border-pink-500"
              />
              {profileClick && (
                <div className="absolute top-12 right-0 bg-white border shadow-lg rounded-md w-32 z-50">
                  <Link href="/">
                    <button className="block w-full text-left px-4 py-2 text-sm cursor-pointer font-bold text-gray-700 hover:text-pink-500">
                      My events
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileClick(false); // close dropdown on click
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left px-4 py-2 text-sm cursor-pointer font-bold text-gray-700 hover:text-pink-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-bold cursor-pointer transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 cursor-pointer"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white">
          {session?.user ? (
            <>
              <div className="flex items-center space-x-2 mt-2">
                <Image
                  src={session.user.image}
                  alt="user"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <Link href="/">
                  <span className="text-gray-700 font-bold transition hover:text-pink-600">
                    {session.user.name}
                  </span>
                </Link>
              </div>
            </>
          ) : null}

          {session?.user ? (
            <div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-left font-medium cursor-pointer w-full text-red-500 hover:underline mt-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-bold cursor-pointer transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
}

export default Header;

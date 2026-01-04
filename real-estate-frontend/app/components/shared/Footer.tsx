"use client";

import { JSX } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

/**
 * Footer component for the entire website.
 */
const Footer = (): JSX.Element => {
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-gray-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-300 pb-2">
            Property Listings
          </h3>
          <p className="text-sm leading-loose text-gray-300">
            Your premier partner in discovering premium properties across
            Nigeria with exceptional service and quality.
          </p>
          <p className="text-xs mt-6 text-gray-400">
            &copy; 2025 Property Listings. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-300 pb-2">
            Quick Links
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
                className="text-base hover:text-blue-200 transition duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/listing"
                className="text-base hover:text-blue-200 transition duration-300"
              >
                Listings
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-base hover:text-blue-200 transition duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-300 pb-2">
            Contact Us
          </h3>
          <p className="text-sm text-gray-300">
            123 Property Lane, Lagos, Nigeria
          </p>
          <p className="text-sm mt-4 text-gray-300">+234 800 123 4567</p>
          <p className="text-sm mt-4 text-gray-300">info@propertylistng.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-2xl font-bold mb-6 border-b-2 border-blue-300 pb-2">
            Connect With Us
          </h3>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-white hover:text-blue-200 transition duration-300"
            >
              <FontAwesomeIcon icon={faFacebookF} size="lg" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-blue-200 transition duration-300"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-blue-200 transition duration-300"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-blue-200 transition duration-300"
            >
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-blue-200 transition duration-300"
            >
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

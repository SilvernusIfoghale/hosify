"use client";

import { JSX } from "react";

/**
 * Hero section for the contact page.
 * Displays a professional, clean header.
 * @returns {JSX.Element} The ContactHero component.
 */
const ContactHero = (): JSX.Element => {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-800 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
          We&apos;d love to hear from you. Send us a message and we&apos;ll
          respond as soon as possible.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;

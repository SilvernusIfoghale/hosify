"use client";

import { JSX } from "react";
import ContactHero from "../components/Contact/ContactHero";
import ContactForm from "../components/Contact/ContactForm";
import ContactInfo from "../components/Contact/ContactInfo";
import Footer from "../components/shared/Footer";

/**
 * Main contact page component.
 * Combines Hero, Form, and Info sections for the contact us page.
 * @returns {JSX.Element} The Contact page component.
 */
const ContactPage = (): JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col">
      <ContactHero />
      <ContactForm />
      <ContactInfo />
      <footer className="relative z-40">
        <Footer />
      </footer>
    </div>
  );
};

export default ContactPage;

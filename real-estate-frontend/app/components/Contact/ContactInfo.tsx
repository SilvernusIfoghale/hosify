"use client";

import { JSX } from "react";

/**
 * Contact information component.
 * Displays business hours and additional information.
 */
const ContactInfo = (): JSX.Element => {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Business Hours */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Business Hours
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM
              </p>
              <p>
                <strong>Saturday:</strong> 10:00 AM - 4:00 PM
              </p>
              <p>
                <strong>Sunday:</strong> Closed
              </p>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Response Time
            </h3>
            <p className="text-gray-600">
              We typically respond to all inquiries within{" "}
              <strong>24 hours</strong> during business days.
            </p>
            <p className="text-gray-600 mt-2">
              For urgent matters, please call us directly.
            </p>
          </div>

          {/* Service Areas */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Service Areas
            </h3>
            <p className="text-gray-600">
              We operate across Lagos and surrounding regions, providing
              comprehensive real estate services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;

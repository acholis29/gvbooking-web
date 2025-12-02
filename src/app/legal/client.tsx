"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { capitalizeWords } from "@/helper/helper";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LegalContent() {
  const searchParams = useSearchParams();
  const menu = searchParams.get("m"); // Ambil nilai query ?menu=A
  return (
    <div className="max-w-screen-xl mx-auto">
      <Breadcrumb pageName="LEGAL" />
      <section className="flex flex-col py-6 px-3 md:px-0 md:p-6gap-1 max-w-screen-md">
        {/* Form Contact Us */}
        <h1 className="text-gray-700 font-semibold ml-2 text-2xl">
          {capitalizeWords(menu ?? "")}
        </h1>
        {menu === "terms and conditions" && (
          <div className="mt-2 ml-2 text-gray-700 text-sm leading-relaxed space-y-4">
            <p className="text-sm text-gray-600">
              Welcome to{" "}
              <span className="font-semibold">Go Vacation Indonesia</span>. By
              accessing or using our website, you agree to comply with and be
              bound by these Terms and Conditions. Please read them carefully
              before using our services.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              1. Acceptance of Terms
            </h2>
            <p className="text-sm text-gray-600">
              By accessing this website, you agree to be bound by these Terms
              and all applicable laws and regulations. If you do not agree, you
              are prohibited from using this site.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              2. Use License
            </h2>
            <p className="text-sm text-gray-600">
              Permission is granted to temporarily download one copy of the
              materials for personal, non-commercial viewing only. You may not
              modify, copy, or use the materials for any commercial purpose.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              3. Disclaimer
            </h2>
            <p className="text-sm text-gray-600">
              The materials on this website are provided “as is”. Go Vacation
              Indonesia makes no warranties, expressed or implied, and hereby
              disclaims all other warranties.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              4. Limitations
            </h2>
            <p className="text-sm text-gray-600">
              In no event shall Go Vacation Indonesia or its suppliers be liable
              for any damages arising out of the use or inability to use the
              materials on this website.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              5. Governing Law
            </h2>
            <p className="text-sm text-gray-600">
              These Terms and Conditions are governed by and construed in
              accordance with the laws of Indonesia, and you irrevocably submit
              to the exclusive jurisdiction of the courts in that location.
            </p>

            <p className="mt-6">
              Last updated:{" "}
              <span className="font-semibold text-xs">October 28, 2025</span>
            </p>
          </div>
        )}

        {menu === "licensing" && (
          <div className="mt-2 ml-2 text-gray-700 text-sm leading-relaxed space-y-4">
            <p className="text-sm text-gray-600">
              This Licensing Agreement outlines the terms under which you may
              use the products, materials, or content provided by{" "}
              <span className="font-semibold">Go Vacation Indonesia</span>. By
              downloading or using any of our materials, you acknowledge that
              you have read, understood, and agree to the terms of this
              agreement.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              1. License Grant
            </h2>
            <p className="text-sm text-gray-600">
              Go Vacation Indonesia grants you a limited, non-exclusive,
              non-transferable license to use the materials solely for personal
              or internal business purposes. You may not sublicense, resell, or
              distribute the materials to third parties.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              2. Restrictions
            </h2>
            <p className="text-sm text-gray-600">
              You agree not to modify, reverse engineer, or reproduce the
              materials in any form without written permission. All rights not
              expressly granted in this agreement are reserved by Go Vacation
              Indonesia.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              3. Ownership
            </h2>
            <p className="text-sm text-gray-600">
              All intellectual property rights in the materials remain the
              exclusive property of Go Vacation Indonesia. This agreement does
              not transfer any ownership rights to you.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              4. Termination
            </h2>
            <p className="text-sm text-gray-600">
              Go Vacation Indonesia reserves the right to terminate your license
              at any time if you fail to comply with the terms of this
              agreement. Upon termination, you must immediately cease all use of
              the licensed materials.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              5. Disclaimer of Warranty
            </h2>
            <p className="text-sm text-gray-600">
              The materials are provided “as is” without any warranty of any
              kind. Go Vacation Indonesia disclaims all warranties, either
              express or implied, including but not limited to the implied
              warranties of merchantability and fitness for a particular
              purpose.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              6. Governing Law
            </h2>
            <p className="text-sm text-gray-600">
              This Licensing Agreement shall be governed by and construed in
              accordance with the laws of Indonesia. Any disputes arising under
              this agreement shall be subject to the exclusive jurisdiction of
              the courts in Indonesia.
            </p>

            <p className="mt-6">
              Last updated:{" "}
              <span className="font-semibold text-xs">October 28, 2025</span>
            </p>
          </div>
        )}

        {menu === "privacy policy" && (
          <div className="mt-2 ml-2 text-gray-700 text-sm leading-relaxed space-y-4">
            <p className="text-sm text-gray-600">
              This <span className="font-semibold">Privacy Policy</span>{" "}
              explains how{" "}
              <span className="font-semibold">Go Vacation Indonesia</span>{" "}
              collects, uses, and protects your personal information when you
              visit or use our website and services. By accessing our website,
              you consent to the data practices described in this policy.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              1. Information We Collect
            </h2>
            <p className="text-sm text-gray-600">
              We may collect personal information such as your name, email
              address, phone number, and any other details you provide when
              contacting us or using our services. We may also collect
              non-personal data such as browser type, device information, and IP
              address for analytics purposes.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              2. How We Use Your Information
            </h2>
            <p className="text-sm text-gray-600">
              The information we collect is used to provide and improve our
              services, respond to inquiries, send updates, and ensure the
              security of our website. We do not sell or rent your personal
              information to third parties.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              3. Data Protection
            </h2>
            <p className="text-sm text-gray-600">
              We take appropriate technical and organizational measures to
              protect your personal data from unauthorized access, disclosure,
              or destruction. However, please note that no internet transmission
              is 100% secure.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">4. Cookies</h2>
            <p className="text-sm text-gray-600">
              Our website may use cookies to enhance your browsing experience
              and collect information about how you use our site. You can choose
              to disable cookies in your browser settings, but some features of
              the website may not function properly.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              5. Third-Party Services
            </h2>
            <p className="text-sm text-gray-600">
              We may use third-party services such as analytics or payment
              processors. These providers have their own privacy policies and we
              encourage you to review them to understand how your data is
              handled.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              6. Your Rights
            </h2>
            <p className="text-sm text-gray-600">
              You have the right to access, correct, or delete your personal
              data. To make a request, please contact us through the information
              provided on our website.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              7. Changes to This Policy
            </h2>
            <p className="text-sm text-gray-600">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date. Please
              review this policy periodically to stay informed.
            </p>

            <h2 className="font-semibold text-lg text-gray-700">
              8. Contact Information
            </h2>
            <p className="text-sm text-gray-600">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at{" "}
              <a
                href="mailto:info@govacation.co.id"
                className="text-blue-600 hover:underline"
              >
                info@govacation.co.id
              </a>
              .
            </p>

            <p className="mt-6">
              Last updated:{" "}
              <span className="font-semibold text-xs">October 28, 2025</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default function Legal() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LegalContent />
    </Suspense>
  );
}

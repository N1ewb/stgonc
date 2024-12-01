import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8">
      <div className="w-full max-w-3xl bg-[#f9f9f9] shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center text-[#320000]">About STGONC</h1>
        <p className="text-lg text-gray-600 text-center mt-4">
          Welcome to STGONC – an online platform designed for students, faculty, and guidance counselors
          to connect, consult, and collaborate efficiently.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-[#720000]">Our Purpose</h2>
          <p className="mt-4 text-gray-700">
            STGONC aims to provide a seamless and effective online platform for students to receive academic
            support, consult with faculty for advice or clarification, and seek guidance from counselors for
            personal and professional development. The system ensures that all members of the school community
            have access to valuable resources to help them succeed.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-[#720000]">What We Offer</h2>
          <ul className="list-disc list-inside mt-4 text-gray-700">
            <li>Student-faculty consultations for academic guidance</li>
            <li>One-on-one sessions with guidance counselors for personal growth</li>
            <li>Easy-to-use scheduling and availability tracking system</li>
            <li>Online video call consultations for flexible access</li>
            <li>Efficient communication tools for real-time support</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-[#720000]">For Whom We Serve</h2>
          <p className="mt-4 text-gray-700">
            STGONC serves a diverse group of users within the educational community:
          </p>
          <ul className="list-disc list-inside mt-4 text-gray-700">
            <li><strong>Students:</strong> Receive academic guidance, schedule consultations, and find personal development support.</li>
            <li><strong>Faculty:</strong> Provide academic consultations, advice, and mentor students.</li>
            <li><strong>Guidance Counselors:</strong> Offer counseling services for personal and professional growth, as well as academic guidance.</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            For more information or inquiries, feel free to{" "}
            <Link to="/Contactus" className="text-[#720000] font-medium hover:underline">
              Contact Us
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just log the inputs or you can implement your API call to handle form submission.
    console.log({ name, email, message });

    // Assuming form submission is successful
    setStatus("Your message has been sent successfully. We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8">
      <div className="w-full max-w-lg bg-[#f9f9f9] shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-[#320000]">Contact Us</h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          We'd love to hear from you. Please fill out the form below.
        </p>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#720000] focus:border-[#720000]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#720000] focus:border-[#720000]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Your Message
            </label>
            <textarea
              id="message"
              rows="4"
              placeholder="Your message here"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#720000] focus:border-[#720000]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#720000] text-white py-2 px-4 rounded-md hover:bg-[#320000] focus:outline-none focus:ring focus:ring-[#720000] focus:ring-opacity-50"
          >
            Send Message
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-green-600">{status}</p>
        )}
      </div>
    </div>
  );
}

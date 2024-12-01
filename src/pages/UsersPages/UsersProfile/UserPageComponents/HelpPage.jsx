import React from "react";

const HelpPage = () => {
  return (
    <div className="min-h-full bg-white text-gray-800">
      <header className="bg-[#720000] text-white py-4 ">
        <div className="container mx-auto text-center flex flex-col">
          <h1 className="text-3xl font-bold text-white">Help & Support</h1>
          <p className="text-sm">Student-Teacher and Guidance for the Online Counseling System</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-h-[70%] overflow-auto flex flex-col [&_section]:flex [&_section]:flex-col [&_section]:items-start [&_section]:w-full">
        <section>
          <h2 className="text-xl font-semibold text-[#320000] mb-4">Getting Started</h2>
          <p className="mb-6">
            This platform is designed to facilitate online counseling sessions between students and teachers or guidance counselors. Below are some quick steps to get started:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Create an account or log in with your school credentials.</li>
            <li>Navigate to the dashboard to view available counselors or teachers.</li>
            <li>Schedule an appointment by selecting an available time slot.</li>
            <li>Join your session using the provided meeting link at the scheduled time.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#320000] mb-4">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How do I reset my password?</h3>
              <p className="text-gray-700">
                Click on "Forgot Password" on the login page and follow the instructions sent to your registered email.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can I reschedule an appointment?</h3>
              <p className="text-gray-700">
                No, no you cant.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Who can I contact for technical support?</h3>
              <p className="text-gray-700">
                Reach out to our support team at <a href="mailto:stgoncteam.spc@gmail.com" className="text-[#720000] underline">stgoncteam.spc@gmail.com</a>.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#320000] mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have additional questions or require assistance, please contact us:
          </p>
          <div className="mt-4">
            <p>Email: <a href="mailto:stgoncteam.spc@gmail.com" className="text-[#720000] underline">stgoncteam.spc@gmail.com</a></p>
            
          </div>
        </section>
      </main>
      <footer className="bg-[#320000] text-white py-4">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Student-Teacher and Guidance Online Consultation System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HelpPage;

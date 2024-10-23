import React from "react";
import elipse from "../../../static/images/AboutElipse.png";
import spcLogo from "../../../static/images/SPC-Logo-White.png";
import stgoncLogo from "../../../static/images/STGONC-Logo.png";

const About = () => {
  return (
    <section
      className="bg-white flex flex-col items-center w-full pt-40 gap-10"
      style={{
        backgroundImage: `url(${elipse})`,
        backgroundPosition: "top",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="spc-logo-wrapper">
        <img src={spcLogo} alt="spc-logo" />
      </div>
      <h1 className="font-bold text-center">
        STUDENT-TEACHER <span className="font-light">AND</span> GUIDANCE <br />{" "}
        ONLINE CONSULTATION
      </h1>
      <div className="stgonc-logo-wrapper flex flex-row gap-3 items-center">
        <img src={stgoncLogo} alt="stgonc-logo" />{" "}
        <p className="font-light m-0 text-[36px] text-[#360000]">stgonc</p>
      </div>
      <div className="developer-statement text-center text-[#320000]">
        <p>
          Is developed as a <span className="font-bold">thesis project</span>{" "}
          for an undergraduate capstone by <br />{" "}
          <span className="font-bold">Nathaniel A. Lucero</span> &{" "}
          <span className="font-bold">Andromel P. Ramirez</span>.
        </p>
      </div>
      <div className="about-statement text-justify w-[40%]">
        <p className="flex flex-col gap-3 text-[#320000]">
          Recognizing the critical importance of comprehensive support and
          guidance for students in higher education, we aimed to address the
          challenges posed by traditional manual consultation methods at St.
          Peter's College, College of Computer Studies. Despite the reliance on
          in-person consultations, which can effectively assess student needs,
          we identified a growing necessity for a more streamlined and
          accessible approach to facilitate timely and efficient communication
          between students and faculty. <span><span className="font-semibold">The Student-Teacher and Guidance Online
          Consultation System (STGONC)</span> was conceived to enhance the educational
          experience by integrating modern technology into the consultation
          process. This web-based application allows students to submit
          consultation requests easily, while providing faculty with a
          centralized platform to manage their schedules and prepare for
          meetings. By incorporating features such as online video conferencing
          and messaging, STGONC addresses the limitations of rigid scheduling
          and offers flexibility in addressing students' academic and personal
          concerns.</span> <span>Our system not only aligns with the guidelines set forth by
          the Commission on Higher Education (CHED) and accrediting bodies like
          PACUCOA, but it also enhances the overall efficiency of student
          support services. <span className="font-semibold">By fostering better communication and resource
          management, STGONC contributes to the academic success and personal
          development of students, while simultaneously aiding faculty in
          delivering effective guidance.</span></span> <span>Ultimately, this project underscores
          <span className="font-semibold"> our commitment to improving student services in higher education
          through innovative technological solutions.</span></span>
        </p>
      </div>
    </section>
  );
};

export default About;

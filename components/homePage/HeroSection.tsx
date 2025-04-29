import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-[#F6F6F6] text-white pt-[90px] pb-[100px] px-[100px]">
      <div className="">
        <h1 className="text-[64px] font-bold mb-2.5 text-[#262262]">
          SpoutBreeze
        </h1>
        <h2 className="text-4xl font-semibold mb-5 text-[#5B5D60]">
          Where Ideas Take the Lead
        </h2>
        <p className="text-[15px] text-[#5B5D60] mb-[15px]">
          SpoutBreeze is a professional platform that simplifies hosting,
          attending, and managing webinars.
          <br />
          With seamless broadcasting and interactive tools, we help you deliver
          impactful virtual experiences.
        </p>
        <p className="text-[#27AAFF] font-medium text-[15px]">
          Let the breeze carry your thoughts loud, clear, and far.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

import Image from "next/image";
import React from "react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-[28px] font-semibold mb-[15px] text-[#262262]">
          Core features
        </h2>
        <p className="text-[15px] text-[#5B5D60]">
          Tools built to power every session.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-32 sm:gap-8 mt-[60px] max-w-4xl mx-auto">
          <div className="container mx-auto text-center">
            <Image
              src="/homePage/stream_icon.svg"
              alt="Feature 1"
              width={80}
              height={80}
              className="mb-5 mx-auto"
            />
            <h3 className="text-[16px] font-medium mb-2.5">
              Seamless Streaming
            </h3>
            <p className="text-[15px] text-[#5B5D60]">
              Host smooth, high-quality live sessions without a hitch.
            </p>
          </div>
          <div className="container mx-auto text-center">
            <Image
              src="/homePage/space_icon.svg"
              alt="Feature 1"
              width={95}
              height={80}
              className="mb-5 mx-auto"
            />
            <h3 className="text-[16px] font-medium mb-2.5">
              Personalized Spaces
            </h3>
            <p className="text-[15px] text-[#5B5D60]">
              Deliver content tailored to your audience
            </p>
          </div>
          <div className="container mx-auto text-center">
            <Image
              src="/homePage/recordbtn_icon.svg"
              alt="Feature 1"
              width={80}
              height={80}
              className="mb-5 mx-auto"
            />
            <h3 className="text-[16px] font-medium mb-2.5">Smart Recordings</h3>
            <p className="text-[15px] text-[#5B5D60]">
              Store, manage, and share past webinars effortlessly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

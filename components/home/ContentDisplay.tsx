import React, { JSX } from "react";

interface ContentDisplayProps {
  component?: JSX.Element;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ component }) => {
  return (
    <section className="items-center bg-white rounded-[10px]">
      {component}
    </section>
  );
};

export default ContentDisplay;

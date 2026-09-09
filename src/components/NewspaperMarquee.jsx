import { useState } from "react";
import "./NewspaperMarquee.css";

const NewspaperMarquee = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("riteshraj851116@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const marqueeText = (
    <div className="marquee-content-track">
      <span className="marquee-black-pill">EMAIL ME</span>
      <span className="marquee-script-phrase">Let's create something together</span>
      <span className="marquee-black-pill">EMAIL ME</span>
      <span className="marquee-script-phrase">riteshraj851116@gmail.com</span>
      <span className="marquee-black-pill">DISPATCH</span>
      <span className="marquee-script-phrase">+91-9709721676 · Galgotias Univ CSE 2026</span>
    </div>
  );

  return (
    <div className="newspaper-marquee-wrapper" id="contact" onClick={handleCopyEmail}>
      <div className="marquee-scroller-inner">
        {marqueeText}
        {marqueeText}
      </div>
      {copied && (
        <div className="copied-broadside-toast">
          <span>COPIED TO CLIPBOARD: RITESHRAJ851116@GMAIL.COM</span>
        </div>
      )}
    </div>
  );
};

export default NewspaperMarquee;

import { useEffect } from "react";

const TranslateWidget = () => {
  useEffect(() => {
    window.gtranslateSettings = {
      default_language: "en",
      native_language_names: true,
      detect_browser_language: true,
      languages: ["en", "hi", "mr"],
      wrapper_selector: ".gtranslate_wrapper",
    };

    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/ln.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div className="gtranslate_wrapper"></div>;
};

export default TranslateWidget;

import { useEffect, useState } from "react";

const usePlatform = () => {
  const [platform, setPlatform] = useState<
    "Windows" | "iPad" | "Android" | "iPhone" | "macOs" | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let os = navigator.userAgent;
      if (os.search("Windows") !== -1) {
        setPlatform("Windows");
      } else if (os.search("iPad") !== -1) {
        setPlatform("iPad");
      } else if (os.search("Android") !== -1) {
        setPlatform("Android");
      } else if (os.search("iPhone") !== -1) {
        setPlatform("iPhone");
      } else if (os.search("Mac") !== -1) {
        setPlatform("macOs");
      } else {
        setPlatform(null)
      }
    }
  }, []);
  return platform;
};

export default usePlatform;

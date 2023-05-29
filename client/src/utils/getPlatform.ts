const getPlatform = () => {
  if (typeof window === "undefined") return null;

  let os = navigator.userAgent;
  if (os.search("Windows") !== -1) return "Windows";
  if (os.search("Android") !== -1) return "Android";
  if (os.search("Mac") !== -1) return "Mac";

  if (os.search("iPad") !== -1) return "iPad";

  if (os.search("iPhone") !== -1) return "iPhone";

  return null;
};

export default getPlatform;
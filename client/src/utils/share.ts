const share = async (props: ShareData): Promise<boolean> => {
  if (navigator.share) {
    try {
      return await navigator.share(props).then(() => true);
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

export default share
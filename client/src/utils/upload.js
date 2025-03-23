import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "communeo");

  try {
    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);

    if (!res.data || !res.data.url) {
      throw new Error("Upload failed - no URL returned");
    }

    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Upload error:", err.message);
    throw new Error("Failed to upload image: " + err.message);
  }
};

export default upload;

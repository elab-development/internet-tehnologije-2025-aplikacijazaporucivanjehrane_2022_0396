import Image from "next/image";
import toast from "react-hot-toast";

export default function EditableImage({ link, setLink }) {
  async function handleFileChange(ev) {
    const files = ev.target.files;
    if (files?.length !== 1) return;

    const data = new FormData();
    data.set("file", files[0]);

    const uploadPromise = fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      if (!response.ok) throw new Error("Upload failed");
      const uploadedLink = await response.json(); // očekuje JSON string (tvoj backend tako vraća)
      setLink(uploadedLink);
      return uploadedLink;
    });

    await toast.promise(uploadPromise, {
      loading: "Uploading...",
      success: "Upload complete",
      error: "Upload error",
    });
  }

  return (
    <>
      {/* ✅ stabilan wrapper sa aspect ratio + object-cover */}
      <div className="relative w-full aspect-square mb-1 overflow-hidden rounded-lg bg-gray-200">
        {link ? (
          <Image
            src={link}
            alt="image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 250px"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>

      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
          Change image
        </span>
      </label>
    </>
  );
}

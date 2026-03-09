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
      if (!response.ok) throw new Error("Otpremanje nije uspelo");
      const uploadedLink = await response.json(); // očekuje JSON string
      setLink(uploadedLink);
      return uploadedLink;
    });

    await toast.promise(uploadPromise, {
      loading: "Otpremanje...",
      success: "Slika je otpremljena",
      error: "Greška pri otpremanju",
    });
  }

  return (
    <>
      <div className="relative w-full aspect-square mb-1 overflow-hidden rounded-lg bg-gray-200">
        {link ? (
          <Image
            src={link}
            alt="slika"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 250px"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Nema slike
          </div>
        )}
      </div>

      <label>
        <input type="file" className="hidden" onChange={handleFileChange} />
        <span className="block border border-gray-300 rounded-lg p-2 text-center cursor-pointer">
          Promeni sliku
        </span>
      </label>
    </>
  );
}

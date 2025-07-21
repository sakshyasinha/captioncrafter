"use client";
import { useState } from "react";
import { Loader2, Copy } from "lucide-react";

export default function CaptionForm() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [tone, setTone] = useState("witty");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image");

    setLoading(true);
    setCaption("");
    setCopied(false);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tone", tone);

    const res = await fetch("http://localhost:5000/generate-caption", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setCaption(data.caption);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg w-full mx-auto px-6 py-10 bg-white/30 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-tight">
        CaptionCrafter 🚀
      </h1>

      <div className="space-y-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-xl w-full h-64 object-cover border border-gray-300 shadow-sm"
          />
        )}

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="witty">Witty</option>
          <option value="professional">Professional</option>
          <option value="poetic">Poetic</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Generating...
            </>
          ) : (
            "Generate Caption"
          )}
        </button>

        {caption && (
          <div className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <p className="text-gray-800">{caption}</p>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-sm text-indigo-600 hover:underline flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

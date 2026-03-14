import React, { useState } from "react";

interface Props {
  onAdd: (tool: any) => void;
}

export const AddToolForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = () => {
    const newTool = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      description,
      url,
      image,
      plan: "Free",
      labels: ["Custom"]
    };

    const stored = JSON.parse(localStorage.getItem("customTools") || "[]");
    stored.push(newTool);
    localStorage.setItem("customTools", JSON.stringify(stored));

    onAdd(newTool);

    setName("");
    setDescription("");
    setUrl("");
    setImage("");
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-10">
      <h3 className="text-lg font-bold mb-4">Tambah Tool Baru</h3>

      <div className="grid gap-3">

        <input
          placeholder="Nama Tool"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
        />

        <input
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
        />

        <input
          placeholder="URL Tool"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
        />

        <button
          onClick={handleSubmit}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2 rounded-lg"
        >
          Tambah Tool
        </button>

      </div>
    </div>
  );
};
"use client";
import { supabase } from "@/lib/supabaseClient"; // You need to create this client with anon key

import React, { useState } from "react";

export default function AddCompany() {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return alert("Enter company name");
    setLoading(true);

    try {
      // 1) Create company in DB
      const createResp = await fetch("/api/companies", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });
      if (!createResp.ok) throw new Error("Failed to create company");
      const company = await createResp.json();
      const companyId = company.id;

      // 2) Upload files via signed URLs
      const uploadedMeta: any[] = [];
      if (files && files.length > 0) {
        // for (const file of Array.from(files)) {
        //   // ask server for signed URL
        //   const urlResp = await fetch("/api/upload-url", {
        //       method: "POST",
        //       body: JSON.stringify({
        //         companyId,
        //         filename: file.name,
        //         contentType: file.type,
        //       }),
        //       headers: { "Content-Type": "application/json" },
        //     });

        //     let urlJson;
        //     try {
        //       urlJson = await urlResp.json();
        //     } catch {
        //       throw new Error("Upload URL API did not return JSON");
        //     }

        //   const { path, signedUrl, error } = await urlJson;
        //   if (error) throw new Error(error);

        //   // upload directly to storage
        //   const uploadResp = await fetch(signedUrl, {
        //     method: "PUT",
        //     headers: { "Content-Type": file.type },
        //     body: file,
        //   });
        //   if (!uploadResp.ok) throw new Error("Upload failed");

        //   uploadedMeta.push({
        //     filename: file.name,
        //     path,
        //     size: file.size,
        //     mime: file.type,
        //   });
        // }
        for (const file of Array.from(files)) {
  // ask server for signed URL
  const urlResp = await fetch("/api/storage/upload-url", {
    method: "POST",
    body: JSON.stringify({
      companyId,
      filename: file.name,
      contentType: file.type,
    }),
    headers: { "Content-Type": "application/json" },
  });

  const { path, token, error } = await urlResp.json();
  if (error) throw new Error(error);

  // Use supabase client to upload
  const { data, error: uploadError } = await supabase.storage
    .from("company-docs")
    .uploadToSignedUrl(path, token, file);

  if (uploadError) throw new Error(uploadError.message);

  uploadedMeta.push({
    filename: file.name,
    path,
    size: file.size,
    mime: file.type,
  });
}

      }

      // 3) Save metadata in DB
      if (uploadedMeta.length) {
        await fetch(`/api/companies/${companyId}/files`, {
          method: "POST",
          body: JSON.stringify({ files: uploadedMeta }),
          headers: { "Content-Type": "application/json" },
        });
      }

      alert("Company added!");
      setName("");
      setFiles(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="border p-2"
        placeholder="Company name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="border p-2"
      />
      <button
        disabled={loading}
        type="submit"
        className="bg-blue-500 text-white px-4 py-2"
      >
        {loading ? "Saving..." : "Add company"}
      </button>
    </form>
  );
}

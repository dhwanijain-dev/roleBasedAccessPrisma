"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CompanyList() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [previewFile, setPreviewFile] = useState<any | null>(null);
  useEffect(() => {
    fetch("/api/companies")
      .then((r) => r.json())
      .then(setCompanies);
  }, []);
  const handleOpenPreview = async (file: any) => {
  // fetch signed URL from your API
  const res = await fetch(`/api/storage/signed-url?path=${encodeURIComponent(file.path)}`);
  const { url } = await res.json();
  setPreviewFile({ ...file, url });
};

  return (
    <div>
      {
        companies.length === 0 && <p className="text-sm text-gray-500">No companies found.</p>
      }
      {companies.map((c) => (
        <div key={c.id} className="border p-2 my-2 rounded">
          <h3 className="font-bold">{c.name}</h3>
          <Button
            variant="outline"
            onClick={() => setSelectedCompany(c)}
            className="mt-2"
          >
            View Documents
          </Button>
        </div>
      ))}

      {/* Dialog for documents */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedCompany?.name} – Documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {selectedCompany?.files?.length ? (
              selectedCompany.files.map((f: any) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <div>
                    <p className="font-medium">{f.filename}</p>
                    <p className="text-xs text-gray-500">
                      {f.mime} – {Math.round(f.size / 1024)} KB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {/* View inline preview if PDF/Image */}
                    {/* {f.mime.startsWith("image/") ? (
                      <img
                        src={f.url}
                        alt={f.filename}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : f.mime === "application/pdf" ? (
                      <iframe
                        src={f.url}
                        className="h-16 w-16 border rounded"
                        title={f.filename}
                      />
                    ) : null} */}

                    {/* Download / Open link */}
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        await handleOpenPreview(f); // fetch signed URL and set previewFile with url
                      }}
                      className="text-blue-600 text-sm underline flex justify-center items-center"
                    >
                      Open
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No files uploaded.</p>
            )}
          </div>
        </DialogContent> 
      </Dialog>
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewFile?.filename}</DialogTitle>
          </DialogHeader>
          <div>
            {previewFile?.mime?.startsWith("image/") ? (
              <img src={previewFile.url} alt={previewFile.filename} className="max-w-full max-h-96" />
            ) : previewFile?.mime === "application/pdf" ? (
              <iframe src={previewFile.url} className="w-full h-96" title={previewFile.filename} />
            ) : (
              <p>No preview available for this file type.</p>
            )}
          </div>
          <a
            href={previewFile?.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm underline flex items-center justify-center border-1 px-2 py-3 wraped-text"
          >
            Download
          </a>
        </DialogContent>
      </Dialog>
    </div>
  );
}

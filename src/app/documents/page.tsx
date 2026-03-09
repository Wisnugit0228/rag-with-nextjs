"use client";

import { useEffect, useState } from "react";
import AppToast from "@/components/common/app-toast";
import UploadCard from "./_components/upload-card";
import DocumentTable, { type TDocument } from "./_components/document-table";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<TDocument[]>([]);
  const [toast, setToast] = useState({
    open: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const fetchDocuments = async () => {
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocuments(data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error",
  ) => {
    setToast({ open: true, title, message, type });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Document Knowledge Base</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage documents for AI-powered search
        </p>
      </div>

      <UploadCard
        onUploadSuccess={fetchDocuments}
        onSuccess={() =>
          showToast("Success", "Document uploaded successfully", "success")
        }
        onError={(msg) => showToast("Error", msg, "error")}
      />

      <DocumentTable documents={documents} />

      <AppToast
        open={toast.open}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}

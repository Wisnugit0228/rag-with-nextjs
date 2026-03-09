"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePermission } from "@/hooks/use-permission";
import { FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  onUploadSuccess: () => void;
  onError: (message: string) => void;
  onSuccess: () => void;
};

export default function UploadCard({
  onUploadSuccess,
  onError,
  onSuccess,
}: Props) {
  const { hasPermission } = usePermission();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const res = await fetch(`/api/documents`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.message);
        return;
      }

      setFile(null);

      if (fileInputRef.current) fileInputRef.current.value = "";

      onUploadSuccess();
      onSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Upload Document</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.xls,.txt,.csv,.json"
            className="flex-1"
            onChange={(e) => {
              if (!e.target.files) return;
              setFile(e.target.files[0]);
            }}
          />
          {hasPermission("documents:create") && (
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {loading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
        {file && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </CardContent>
    </Card>
  );
}

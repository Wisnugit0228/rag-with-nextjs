import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { useState } from "react";
import DocumentStatusBadge from "./status-badge";

type User = {
  id: string;
  name: string;
};

export type TDocument = {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  uploadedBy: User;
  status: string;
};

type Props = {
  documents: TDocument[];
};

export default function DocumentTable({ documents }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginatedDocs = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Document Library</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-[200px] pl-8 h-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <th className="py-2.5 px-6 font-medium text-muted-foreground">
                Title
              </th>
              <th className="py-2.5 px-4 font-medium text-muted-foreground">
                Uploaded By
              </th>
              <th className="py-2.5 px-4 font-medium text-muted-foreground">
                Date
              </th>
              <th className="py-2.5 px-4 font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-muted-foreground"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No documents found</p>
                </td>
              </tr>
            ) : (
              paginatedDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-6 font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      {doc.title}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {doc.uploadedBy?.name ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <DocumentStatusBadge status={doc.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-xs border rounded-md disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 text-xs border rounded-md ${
                  page === i + 1 ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 text-xs border rounded-md disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

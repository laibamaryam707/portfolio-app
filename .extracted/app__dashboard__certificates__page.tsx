"use client";

import { useEffect, useState, useCallback } from "react";
import CrudList from "@/components/ui/CrudList";
import type { CertificateData } from "@/lib/types";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/certificates").then((r) => r.json()).then((d) => setCertificates(d.certificates || []));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <CrudList<CertificateData>
      title="Certificates"
      items={certificates}
      apiPath="/api/certificates"
      onRefresh={refresh}
      emptyMessage="No certificates yet. Add your achievements."
      getInitialForm={() => ({ title: "", issuer: "", date: "", url: "", image: "" })}
      fields={[
        { name: "title", label: "Title", placeholder: "AWS Certified Developer" },
        { name: "issuer", label: "Issuer", placeholder: "Amazon Web Services" },
        { name: "date", label: "Date", placeholder: "2024" },
        { name: "url", label: "Certificate URL", type: "url" },
        { name: "image", label: "Image URL", type: "url" },
      ]}
      renderItem={(item) => (
        <div>
          <p className="text-white font-medium">{item.title}</p>
          <p className="text-sm text-slate-400">{item.issuer}</p>
          {item.date && <p className="text-xs text-slate-500 mt-1">{item.date}</p>}
        </div>
      )}
    />
  );
}

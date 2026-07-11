"use client";

import { useEffect, useState, useCallback } from "react";
import CrudList from "@/components/ui/CrudList";
import type { CustomCardData } from "@/lib/types";

export default function CustomCardsPage() {
  const [customCards, setCustomCards] = useState<CustomCardData[]>([]);

  const refresh = useCallback(() => {
    fetch("/api/custom-cards").then((r) => r.json()).then((d) => setCustomCards(d.customCards || []));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <CrudList<CustomCardData>
      title="Custom Cards"
      items={customCards}
      apiPath="/api/custom-cards"
      onRefresh={refresh}
      emptyMessage="No custom cards yet. Add anything you want to showcase."
      getInitialForm={() => ({ title: "", description: "", icon: "✨", category: "custom" })}
      fields={[
        { name: "title", label: "Title", placeholder: "What I Do" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Icon (emoji)", placeholder: "🚀" },
        { name: "category", label: "Category", placeholder: "custom" },
      ]}
      renderItem={(item) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <p className="text-white font-medium">{item.title}</p>
            <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
          </div>
        </div>
      )}
    />
  );
}

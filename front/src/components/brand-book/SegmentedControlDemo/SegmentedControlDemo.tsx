"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import SegmentedControl from "@/components/ui/SegmentedControl";
import { SegmentedControlDemoRoot } from "./SegmentedControlDemo.style";
import { segmentedControlDemoClasses } from "./SegmentedControlDemo.util";

/** Holds the state a server page cannot, so the specimen stays interactive. */
export default function SegmentedControlDemo() {
  const [sort, setSort] = useState<"urgency" | "kind">("urgency");

  return (
    <SegmentedControlDemoRoot className={segmentedControlDemoClasses.root}>
      <SegmentedControl
        label="Sort"
        value={sort}
        onChange={setSort}
        options={[
          { value: "urgency", label: "Urgency" },
          { value: "kind", label: "Type" },
        ]}
      />
      <SegmentedControl
        label="Change week"
        value="current"
        onChange={() => {}}
        options={[
          {
            value: "previous",
            icon: ChevronLeft,
            ariaLabel: "Previous",
            action: true,
          },
          { value: "current", label: "This" },
          {
            value: "next",
            icon: ChevronRight,
            ariaLabel: "Next",
            action: true,
          },
        ]}
      />
    </SegmentedControlDemoRoot>
  );
}

import { ArrowRight } from "lucide-react";

export default function NextStop({
  href,
  label,
  onNavy = false,
}: {
  href: string;
  label: string;
  onNavy?: boolean;
}) {
  return (
    <a href={href} className={`next-stop ${onNavy ? "next-stop--on-navy" : ""}`}>
      {label} <ArrowRight size={14} />
    </a>
  );
}

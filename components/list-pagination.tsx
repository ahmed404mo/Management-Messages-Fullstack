"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}

export function PaginationControls({ currentPage, totalPages, onPageChange, className = "" }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 py-8 px-2 ${className}`} dir="rtl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="الصفحة السابقة"
        className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
          currentPage === 1
            ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-950 hover:text-white hover:border-slate-950"
        }`}
      >
        <ChevronRight size={20} />
      </button>

      {getPageNumbers(currentPage, totalPages).map((page, idx) => (
        <button
          key={idx}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
          className={`min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-2 rounded-xl font-black text-xs sm:text-sm transition-all ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : typeof page === "number"
                ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                : "text-slate-400 cursor-default"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="الصفحة التالية"
        className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
          currentPage === totalPages
            ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-950 hover:text-white hover:border-slate-950"
        }`}
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}

export function RoutePagination({ page, totalPages, className = "" }: { page: number; totalPages: number; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={goTo} className={className} />;
}

import { prisma } from "@/lib/prisma";
import ExternalFormClient from "./external-form-client"; // سنحول الجزء ده لـ Client Component بسيط عشان الـ Popups
import { Globe, School, Trash2, Award, Search } from "lucide-react";

const PAGE_SIZE = 12;

export default async function ExternalsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Math.max(parseInt(params?.page ?? "1", 10) || 1, 1);

  const [externals, total] = await Promise.all([
    prisma.externalExaminer.findMany({
      orderBy: { name: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.externalExaminer.count(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4" dir="rtl">
      
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 rotate-3 transition-transform duration-300">
            <Globe size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">المناقشين الخارجيين</h1>
            <p className="text-sm font-bold text-slate-500 mt-2 italic opacity-80">إدارة قاعدة بيانات الممتحنين من الجامعات الأخرى</p>
          </div>
        </div>
        <div className="bg-slate-100 px-5 py-3 rounded-2xl">
          <span className="font-black text-slate-700">إجمالي: {total}</span>
        </div>
      </div>

      <ExternalFormClient
        initialData={externals}
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE)}
      />
    </div>
  );
}
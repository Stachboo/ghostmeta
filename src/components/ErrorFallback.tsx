import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

export default function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-center min-h-screen p-8"
      style={{ backgroundColor: "#0a0a0c" }}
    >
      <div className="flex flex-col items-center w-full max-w-2xl p-8 border border-[#00ff41]/20 rounded-lg backdrop-blur-sm bg-black/40">

        {/* Header - Amber accent for error */}
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle
            size={32}
            className="flex-shrink-0"
            style={{ color: "#f59e0b" }}
          />
          <span
            className="text-xs font-bold tracking-[4px] uppercase"
            style={{ color: "#f59e0b" }}
          >
            {t("error.system_failure")}
          </span>
        </div>

        {/* Title - Neon Green accent */}
        <h2
          className="text-lg font-bold tracking-widest uppercase mb-2"
          style={{ color: "#00ff41" }}
        >
          {t("error.render_error")}
        </h2>
        <p className="text-sm text-gray-400 mb-6 text-center">
          {t("error.description")}
          <br />
          {t("error.description_local")}
        </p>

        {/* Stack trace */}
        <div
          className="w-full rounded-md border border-[#00ff41]/10 overflow-auto mb-6 p-4"
          style={{ backgroundColor: "#0f1210" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={12} style={{ color: "#00ff41" }} />
            <span
              className="text-xs font-bold tracking-widest"
              style={{ color: "#00ff41" }}
            >
              {t("error.stack_trace")}
            </span>
          </div>
          <pre
            className="text-xs whitespace-pre-wrap break-all"
            style={{ color: "#6b7280", fontFamily: "monospace" }}
          >
            {error?.stack ?? t("error.no_stack")}
          </pre>
        </div>

        {/* CTA - Neon Green button */}
        <button
          onClick={onReset}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-bold tracking-widest uppercase",
            "border border-[#00ff41]/40 transition-all duration-200",
            "hover:border-[#00ff41] hover:shadow-[0_0_16px_rgba(0,255,65,0.25)]"
          )}
          style={{ color: "#00ff41", backgroundColor: "transparent" }}
        >
          <RotateCcw size={14} />
          {t("error.reset")}
        </button>

        {/* Footer note */}
        <p className="text-xs text-gray-600 mt-6 tracking-widest uppercase">
          {t("error.footer_note")}
        </p>
      </div>
    </div>
  );
}

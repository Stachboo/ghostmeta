import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Terminal } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Privacy-first : log local uniquement, aucun envoi serveur
    console.error("[GhostMeta] Render Error:", error);
    console.error("[GhostMeta] Component Stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex items-center justify-center min-h-screen p-8"
          style={{ backgroundColor: "#0a0a0c" }}
        >
          <div className="flex flex-col items-center w-full max-w-2xl p-8 border border-[#00ff41]/20 rounded-lg">

            {/* Header */}
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
                SYSTEM_FAILURE
              </span>
            </div>

            {/* Title */}
            <h2
              className="text-lg font-bold tracking-widest uppercase mb-2"
              style={{ color: "#00ff41" }}
            >
              GHOSTMETA — RENDER ERROR
            </h2>
            <p className="text-sm text-gray-400 mb-6 text-center">
              An unexpected error interrupted the rendering pipeline.
              <br />
              No data was transmitted. Processing is strictly local.
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
                  STACK TRACE
                </span>
              </div>
              <pre
                className="text-xs whitespace-pre-wrap break-all"
                style={{ color: "#6b7280", fontFamily: "monospace" }}
              >
                {this.state.error?.stack ?? "No stack trace available."}
              </pre>
            </div>

            {/* CTA */}
            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-bold tracking-widest uppercase",
                "border border-[#00ff41]/40 transition-all duration-200",
                "hover:border-[#00ff41] hover:shadow-[0_0_16px_rgba(0,255,65,0.25)]"
              )}
              style={{ color: "#00ff41", backgroundColor: "transparent" }}
            >
              <RotateCcw size={14} />
              REINITIALISER
            </button>

            {/* Footer note */}
            <p className="text-xs text-gray-600 mt-6 tracking-widest uppercase">
              All processing remains local — zero network exposure
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

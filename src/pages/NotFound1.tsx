import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c]">
      <Card className="w-full max-w-lg mx-4 border border-dashed border-red-500/50 bg-[#0a0a0c]/80 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,0,0.08)]">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-500" />
            </div>
          </div>

          <h1 className="text-5xl font-mono font-bold text-red-500 mb-2 tracking-widest">
            404
          </h1>
          <h2 className="text-lg font-semibold text-white/80 mb-3 uppercase tracking-wider">
            Zone introuvable
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <Button
            onClick={() => navigate("/")}
            className="bg-[#00ff41] hover:bg-[#00ff41]/80 text-black font-semibold tracking-wide"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

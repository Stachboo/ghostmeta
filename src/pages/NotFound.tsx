import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c]">
      <Helmet>
        <title>{t('not_found.seo_title')}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
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
            {t('not_found.title')}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
            {t('not_found.description')}
          </p>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-black transition-all duration-300 bg-[#00ff41] rounded-full hover:bg-[#00dd38] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('not_found.back')}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

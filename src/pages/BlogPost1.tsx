import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Calendar, Shield, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import GhostLogo from '@/components/GhostLogo';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // On vérifie si l'article existe dans les traductions
  const postExists = t(`blog.posts.${slug}.title`) !== `blog.posts.${slug}.title`;

  if (!postExists) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-4">
        <GhostLogo size={60} glow />
        <h1 className="mt-8 text-2xl font-bold text-white">System Error: Post Not Found</h1>
        <Button onClick={() => navigate('/')} className="mt-4 bg-[#00ff41] text-black hover:bg-[#00dd38]">
          Return to Base
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground font-sans">
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GhostLogo size={32} />
            <span className="font-bold text-white tracking-tight">Ghost<span className="text-[#00ff41]">Meta</span></span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-muted-foreground hover:text-[#00ff41]">
            <ChevronLeft className="w-4 h-4 mr-1" /> {t('common.back_home')}
          </Button>
        </div>
      </header>

      <main className="container max-w-3xl py-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Meta Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-mono text-[#00ff41]">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 2026</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
              <span className="flex items-center gap-1 text-amber-500"><Shield className="w-3 h-3" /> Encrypted Content</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {t(`blog.posts.${slug}.title`)}
            </h1>
            <p className="text-xl text-muted-foreground italic border-l-4 border-[#00ff41] pl-4">
              {t(`blog.posts.${slug}.desc`)}
            </p>
          </div>

          <div className="aspect-video rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <GhostLogo size={100} className="opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
          </div>

          {/* Article Content - On injecte le HTML de i18next */}
          <div 
            className="prose prose-invert prose-green max-w-none text-muted-foreground leading-relaxed
            prose-headings:text-white prose-strong:text-[#00ff41] prose-a:text-[#00ff41] hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: t(`blog.posts.${slug}.content`) }}
          />
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}

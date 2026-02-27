import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Shield } from 'lucide-react';
import Footer from '@/components/Footer';
import GhostLogo from '@/components/GhostLogo';
import DOMPurify from 'dompurify';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Supprimer le contenu pre-rendu quand React prend le relais
  useEffect(() => {
    document.getElementById('bot-content')?.remove();
  }, []);

  // Vérification robuste de l'existence de l'article
  const titleKey = `blog.posts.${slug}.title`;
  const contentKey = `blog.posts.${slug}.content`;
  const postExists = i18n.exists(titleKey);

  if (!postExists) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center p-4">
        <GhostLogo size={60} glow />
        <h1 className="mt-8 text-2xl font-bold text-white">404: POST_NOT_FOUND</h1>
        <p className="text-muted-foreground mt-2 font-mono text-xs">ID: {slug}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-black transition-all duration-300 bg-[#00ff41] rounded-full hover:bg-[#00dd38]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Base
        </button>
      </div>
    );
  }

  // Sanitization du contenu HTML pour prévenir XSS
  // Liste étendue des balises autorisées pour préserver la mise en forme
  const rawContent = t(contentKey);
  const sanitizedContent = DOMPurify.sanitize(rawContent, {
    ALLOWED_TAGS: [
      // Texte de base
      'p', 'br', 'span', 'div', 'hr',
      // Titres
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Mise en forme
      'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
      // Listes
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      // Liens
      'a',
      // Citations
      'blockquote', 'q', 'cite',
      // Code
      'code', 'pre', 'kbd', 'samp', 'var',
      // Médias
      'img', 'figure', 'figcaption',
      // Tableaux
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'colgroup', 'col',
      // Sections
      'section', 'article', 'aside', 'header', 'footer', 'main', 'nav', 'details', 'summary',
      // Divers
      'abbr', 'address', 'bdi', 'bdo', 'dfn', 'time', 'wbr'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title', 'alt', 'src', 'width', 'height', 
      'class', 'id', 'style', 'align', 'valign', 'colspan', 'rowspan',
      'datetime', 'cite', 'download', 'loading', 'decoding'
    ],
    ALLOW_DATA_ATTR: false,
    // Garder le contenu des balises non autorisées (pas juste les supprimer)
    KEEP_CONTENT: true,
  });

  const postTitle = t(titleKey);
  const postDesc = t(`blog.posts.${slug}.desc`);
  const canonicalUrl = `https://www.ghostmeta.online/blog/${slug}`;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground font-sans">
      <Helmet>
        <title>{postTitle} | GhostMeta</title>
        <meta name="description" content={postDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hreflang="fr" href={canonicalUrl} />
        <link rel="alternate" hreflang="en" href={`${canonicalUrl}?lng=en`} />
        <link rel="alternate" hreflang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDesc} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: postTitle,
            description: postDesc,
            author: {
              "@type": "Organization",
              name: "GhostMeta Labs",
            },
            publisher: {
              "@type": "Organization",
              name: "GhostMeta Labs",
              logo: {
                "@type": "ImageObject",
                url: "https://www.ghostmeta.online/icon-192.png",
              },
            },
            datePublished: "2026-02-20",
            dateModified: "2026-02-20",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": canonicalUrl,
            },
            image: {
              "@type": "ImageObject",
              url: "https://www.ghostmeta.online/og-image-v2.jpg",
              width: 1200,
              height: 630,
            },
          })}
        </script>
      </Helmet>
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GhostLogo size={32} />
            <span className="font-bold text-white tracking-tight">Ghost<span className="text-[#00ff41]">Meta</span></span>
          </Link>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-black transition-all duration-300 bg-[#00ff41] rounded-full hover:bg-[#00dd38]"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {t('common.back_home')}
          </button>
        </div>
      </header>

      <main className="container max-w-3xl py-12 px-4">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={slug}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs font-mono text-[#00ff41]">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date().getFullYear()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
              <span className="flex items-center gap-1 text-amber-500"><Shield className="w-3 h-3" /> Encrypted Content</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {postTitle}
            </h1>
            <p className="text-xl text-muted-foreground italic border-l-4 border-[#00ff41] pl-4">
              {postDesc}
            </p>
          </div>

          <div className="aspect-video rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <GhostLogo size={100} className="opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
          </div>

          {/* Rendu du contenu HTML SANITISÉ */}
          <div 
            className="prose prose-invert prose-green max-w-none text-muted-foreground leading-relaxed
            prose-headings:text-white prose-strong:text-[#00ff41] prose-a:text-[#00ff41] hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}

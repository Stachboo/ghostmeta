import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

const SEO = ({ title, description, image }: SEOProps) => {
  const { pathname } = useLocation();
  
  // FORCE LE WWW ICI - C'est la base immuable de ton projet
  const baseUrl = "https://www.ghostmeta.online";
  
  // Construction de l'URL canonique propre
  const canonicalUrl = `${baseUrl}${pathname === '/' ? '' : pathname}`;
  const fullImageUrl = `${baseUrl}${image || '/og-image.jpg'}`;

  return (
    <Helmet>
      {/* Balises de base */}
      <title>{title ? `${title} | GhostMeta` : 'GhostMeta | Nettoyeur Photo Vinted'}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook / Discord) */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

export default SEO;

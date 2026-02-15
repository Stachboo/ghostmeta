import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../config/blogConfig';

export default function BlogPage() {
  const { slug } = useParams();
  const post = blogPosts[slug as keyof typeof blogPosts];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-10 font-sans">
      <div className="max-w-2xl w-full border border-[#00ff41]/20 bg-[#00ff41]/5 p-8 rounded-xl backdrop-blur-md">
        <h1 className="text-3xl font-bold text-[#00ff41] mb-6">
          {post ? post.title : "Page non trouvée"}
        </h1>
        <p className="text-amber-500 font-mono text-sm mb-8">STATUS: SKELETON_PAGE_ACTIVE</p>
        <div className="h-40 border border-dashed border-white/10 flex items-center justify-center text-muted-foreground italic">
          Contenu en cours de rédaction...
        </div>
        <Link to="/" className="mt-8 inline-block text-sm text-[#00ff41] hover:underline">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

/**
 * GhostMeta Footer
 * ────────────────
 * Footer avec mentions légales et liens.
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GhostLogo from './GhostLogo';

export default function Footer() {
  const [showLegal, setShowLegal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="border-t border-border/30 mt-20 py-8">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GhostLogo size={24} />
              <span className="text-sm text-muted-foreground">
                GhostMeta © {new Date().getFullYear()} — Tous droits réservés
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-[#00ff41] transition-colors"
              >
                Politique de confidentialité
              </button>
              <button
                onClick={() => setShowLegal(true)}
                className="hover:text-[#00ff41] transition-colors"
              >
                Mentions légales
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Politique de Confidentialité</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p>
              <strong className="text-foreground">Dernière mise à jour :</strong> Février 2026
            </p>
            <h3 className="text-foreground font-semibold mt-4">1. Architecture Local-Only</h3>
            <p>
              GhostMeta utilise une architecture de traitement exclusivement locale. Vos photos sont traitées 
              directement dans votre navigateur web via des technologies JavaScript et WebAssembly. 
              <strong className="text-foreground"> Aucune image, aucune métadonnée, aucune donnée personnelle 
              n'est transmise à nos serveurs ou à des tiers.</strong>
            </p>
            <h3 className="text-foreground font-semibold mt-4">2. Données collectées</h3>
            <p>
              Nous ne collectons aucune donnée personnelle liée à vos images. Les seules données collectées 
              sont des statistiques d'utilisation anonymisées (nombre de visites, pages consultées) via un 
              outil d'analyse respectueux de la vie privée.
            </p>
            <h3 className="text-foreground font-semibold mt-4">3. Cookies et stockage local</h3>
            <p>
              GhostMeta utilise le localStorage de votre navigateur uniquement pour stocker votre statut 
              d'accès Pro (token de paiement). Aucun cookie de tracking n'est utilisé.
            </p>
            <h3 className="text-foreground font-semibold mt-4">4. Conformité RGPD</h3>
            <p>
              Conformément à l'article 25 du RGPD (Privacy by Design), notre architecture garantit que 
              nous n'effectuons aucune "collecte" ni "stockage" de données à caractère personnel. 
              Vous conservez le contrôle total de vos données à tout moment.
            </p>
            <h3 className="text-foreground font-semibold mt-4">5. Contact</h3>
            <p>
              Pour toute question relative à la protection de vos données, contactez-nous à : 
              <span className="text-[#00ff41]"> contact@ghostmeta.fr</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Notice Modal */}
      <Dialog open={showLegal} onOpenChange={setShowLegal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Mentions Légales</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
            <h3 className="text-foreground font-semibold">1. Éditeur du site</h3>
            <p>
              GhostMeta est édité par [Nom de l'entreprise / Entrepreneur individuel].<br />
              SIRET : [À compléter]<br />
              Adresse : [À compléter]<br />
              Email : contact@ghostmeta.fr<br />
              Téléphone : [À compléter]
            </p>
            <h3 className="text-foreground font-semibold mt-4">2. Hébergement</h3>
            <p>
              Le site est hébergé par [Nom de l'hébergeur].<br />
              Adresse : [À compléter]
            </p>
            <h3 className="text-foreground font-semibold mt-4">3. Propriété intellectuelle</h3>
            <p>
              L'ensemble du contenu de ce site (textes, graphismes, logos, icônes, images, logiciels) 
              est la propriété exclusive de l'éditeur et est protégé par les lois françaises et 
              internationales relatives à la propriété intellectuelle.
            </p>
            <h3 className="text-foreground font-semibold mt-4">4. Limitation de responsabilité</h3>
            <p>
              GhostMeta est fourni "en l'état". L'éditeur ne saurait être tenu responsable de toute 
              perte de données, corruption de fichier ou dommage résultant de l'utilisation du service. 
              L'utilisateur est seul responsable de la conservation de ses fichiers originaux.
            </p>
            <h3 className="text-foreground font-semibold mt-4">5. Droit applicable</h3>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige, 
              les tribunaux français seront seuls compétents.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-6">
              TVA non applicable, art. 293 B du CGI
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

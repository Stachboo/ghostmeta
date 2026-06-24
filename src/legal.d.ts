// Permet d'importer des fichiers Markdown bruts (?raw) — utilisé pour les
// documents légaux rendus dans LegalPage (source = /legal-templates/*.md).
declare module "*.md?raw" {
  const content: string;
  export default content;
}

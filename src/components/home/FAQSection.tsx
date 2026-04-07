import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  const { t } = useTranslation();

  return (
    <section className="max-w-2xl mx-auto py-16 space-y-6">
      <h2 className="text-2xl font-bold text-center">{t('info.faq_title')}</h2>
      <Accordion type="single" collapsible className="w-full">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <AccordionItem key={num} value={`item-${num}`}>
            <AccordionTrigger className="text-left">{t(`info.q${num}`)}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{t(`info.a${num}`)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

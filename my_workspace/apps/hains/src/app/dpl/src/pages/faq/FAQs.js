import { dienstplanerFAQS } from "./dienstplanerFAQS";

// Holt die FAQS für den Dienstplaner und erstellt automatisch die Id zu den Elementen
const getFAQSList = (start = 0, faqsListe = []) => faqsListe.map((obj, i) => {
  obj.id = start + i + 1;
  return obj;
});

export const FAQS = () => {
  const arr = getFAQSList(0, dienstplanerFAQS);
  // Weitere Gruppen könnten über Concat hinzugefügt werden
  return arr;
};

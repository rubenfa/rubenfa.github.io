// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { type Multilingual } from "@/i18n";

export const SITE_TITLE: string | Multilingual = "rubenfa";

export const SITE_DESCRIPTION: string | Multilingual = {
  en: "A blog about software development, technology, personal development, and other things in life",
  es: "Un blog sobre desarrollo de software, tecnología, desarrollo personal, y otras cosas de la vida"
};

export const X_ACCOUNT: string | Multilingual = "@psephopaiktes";

export const NOT_TRANSLATED_CAUTION: string | Multilingual = {
  en: "This page is not available in your language.",
  es: "Esta página no está disponible en tu idioma."
};

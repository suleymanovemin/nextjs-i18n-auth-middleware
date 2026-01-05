import "server-only";

const dictionaries = {
    en: () => import("../../dictionaries/en.json").then((module) => module.default),
    az: () => import("../../dictionaries/az.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
    return dictionaries[locale]();
};
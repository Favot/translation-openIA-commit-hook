export type UpdatedTranslationItem = {
  screenName: string;
  screenContext: string;
  translationKey: string;
  updatedTranslation: string;
};

export type UpdatedTranslationData = {
  appContext: string | null;
  updatedItems: UpdatedTranslationItem[];
};

export type TranslationContent = {
  appContext?: string;
  [context: string]: any;
};

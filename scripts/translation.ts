import env from "dotenv";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { UpdatedTranslationItem } from "./type";
import { getChangedFiles, processFile } from "./utils";
const LANGUAGES = ["de", "fr", "en-us"];

const TRANSLATION_DIR = "./src/localization/translations";

const openAiApiKey = env.config().parsed?.OPENAI_API_KEY;

const main = async () => {
  const files = getChangedFiles();

  const updatedItemsToString = (
    updatedItems: UpdatedTranslationItem[]
  ): string => {
    return updatedItems
      .map((item) => {
        return (
          `screenName: ${item.screenName}\n` +
          `Screen Context: ${item.screenContext}\n` +
          `translationKey: ${item.translationKey}\n` +
          `updatedTranslation: ${item.updatedTranslation}\n`
        );
      })
      .join("\n");
  };

  const openai = new OpenAI({
    apiKey: openAiApiKey,
  });

  files.forEach(async (file) => {
    const updatedTranslationData = processFile(file);

    if (updatedTranslationData?.updatedItems.length > 0) {
      console.log(updatedTranslationData);

      const content = `In the next data translate each updatedTranslation key into ge, fr and en-us, also return the translationKey and screenName value for each updatedTranslation key
      data :
       appContext = ${updatedTranslationData.appContext}
        appKey = ${updatedItemsToString(updatedTranslationData.updatedItems)}


      - the response / output message should be an json with only the updatedTranslation key translated into ge, fr and gb-us
     
      example :
      {
        de:[{
          screenName: do not translate this key just return the screenName value
          translationKey: do not translate this key just return the translationKey value 
          updatedTranslation :  translation first updatedTranslation key
        },
        {
          screenName: do not translate this key just return the screenName value
          translationKey: do not translate this key just return the translationKey value 
          updatedTranslation : translation seconde updatedTranslation key
        }
        ...],
        fr: [{
          screenName: do not translate this key just return the screenName value
          translationKey: do not translate this key just return the translationKey value 
          updatedTranslation : translation first updatedTranslation key
          },
           {
            screenName: do not translate this key just return the screenName value
            translationKey: do not translate this key just return the translationKey value 
            updatedTranslation : translation seconde updatedTranslation key
          }
          ...],
        en-us: [{
          screenName: do not translate this key just return the screenName value
          translationKey: do not translate this key just return the translationKey value 
          updatedTranslation : translation first updatedTranslation key
        },
        {
          screenName: do not translate this key just return the screenName value
          translationKey: do not translate this key just return the translationKey value 
          updatedTranslation : translation seconde updatedTranslation key
        }
        ...],
      }
    ]
  `;
      console.log(
        "🚀 ~ file: translation.ts:54 ~ files.forEach ~ content:",
        content
      );

      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const responds = JSON.parse(chatCompletion.choices[0].message.content);

      console.log(responds);

      LANGUAGES.forEach((lang) => {
        // Construct the file path for the language JSON file
        const filePath = path.join(TRANSLATION_DIR, `${lang}.json`);

        // Load the existing translations
        const existingTranslations = fs.existsSync(filePath)
          ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
          : {};

        // Iterate through the response and update/add translations
        responds[lang].forEach((item: UpdatedTranslationItem) => {
          const context = item.screenName;
          const key = item.translationKey;
          const updatedTranslation = item.updatedTranslation;

          if (!existingTranslations[context]) {
            existingTranslations[context] = {};
          }

          // Update or add the translation
          existingTranslations[context][key] = updatedTranslation;
        });

        // Write the updated translations back to the file
        fs.writeFileSync(
          filePath,
          JSON.stringify(existingTranslations, null, 2),
          "utf-8"
        );
      });
    } else {
      console.log("No updates found");
    }
  });
};

main();

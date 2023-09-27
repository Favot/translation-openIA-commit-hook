import * as shell from "shelljs";

interface UpdatedTranslationItem {
  screenName: string;
  screenContext: string;
  translationKey: string;
  updatedTranslation: string;
}

interface UpdatedTranslationData {
  appContext: string | null;
  updatedItems: UpdatedTranslationItem[];
}

// Initialize the result object
const updatedTranslationData: UpdatedTranslationData = {
  appContext: null,
  updatedItems: [],
};

// Adjusted command to match the correct directory structure
const command =
  'git diff-index --name-only --cached --diff-filter=d HEAD | grep -E "^src/localization/translations/.*[a-z]{2}(-[a-z]{2})?\\.json$"';

const result = shell.exec(command, { silent: true });

if (result.code !== 0) {
  console.log("No translation file change detected");
  process.exit(0);
}

const files = result.stdout.trim().split("\n");

for (const file of files) {
  if (shell.test("-f", file)) {
    // Get the staged content of the file
    const stagedContentResult = shell.exec(`git show :${file}`, {
      silent: true,
    });
    if (stagedContentResult.code !== 0) {
      console.error(
        `Error in getting staged content for file ${file}:`,
        stagedContentResult.stderr
      );
      continue;
    }

    // Parse the staged content as JSON
    const stagedContent = JSON.parse(stagedContentResult.stdout);

    // Get the content of the file in HEAD
    const headContentResult = shell.exec(`git show HEAD:${file}`, {
      silent: true,
    });
    const headContent =
      headContentResult.code === 0 ? JSON.parse(headContentResult.stdout) : {};

    // Traverse the JSON objects to compare each key at every level
    for (const [context, contextValue] of Object.entries(stagedContent)) {
      if (context === "appContext") {
        if (
          !headContent.hasOwnProperty(context) ||
          headContent[context] !== contextValue
        ) {
          updatedTranslationData.appContext = contextValue as string;
        }
      } else if (typeof contextValue === "object") {
        for (const [screenName, screenValue] of Object.entries(contextValue)) {
          if (typeof screenValue === "object") {
            const screenContext = screenValue["screenContext"] as string;
            for (const [key, value] of Object.entries(screenValue)) {
              if (
                !headContent[context]?.[screenName]?.hasOwnProperty(key) ||
                headContent[context][screenName][key] !== value
              ) {
                updatedTranslationData.updatedItems.push({
                  screenName,
                  screenContext,
                  translationKey: key,
                  updatedTranslation: value as string,
                });
              }
            }
          }
        }
      }
    }

    // If updatedItems length is greater than 0, update appContext
    if (
      updatedTranslationData.updatedItems.length > 0 &&
      stagedContent.hasOwnProperty("appContext")
    ) {
      updatedTranslationData.appContext = stagedContent.appContext;
    }
  }
}

console.log(updatedTranslationData);

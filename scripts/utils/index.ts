import * as shell from "shelljs";
import { UpdatedTranslationData } from "../type";

export const executeCommand = (command: string) => {
  const result = shell.exec(command, { silent: true });
  if (result.code !== 0) {
    console.error(`Error executing command: ${command}`, result.stderr);
    return null;
  }
  return result.stdout.trim();
};

export const getChangedFiles = (): string[] => {
  const command =
    'git diff-index --name-only --cached --diff-filter=d HEAD | grep -E "^src/localization/translations/.*[a-z]{2}(-[a-z]{2})?\\.json$"';
  const output = executeCommand(command);
  return output ? output.split("\n") : [];
};

export const getFileContent = (gitRef: string, filePath: string) => {
  const command = `git show ${gitRef}:${filePath}`;
  const output = executeCommand(command);
  return output ? JSON.parse(output) : {};
};

export const compareAndCaptureUpdates = (
  stagedContent: any,
  headContent: any
): UpdatedTranslationData => {
  const updatedTranslationData: UpdatedTranslationData = {
    appContext: null,
    updatedItems: [],
  };

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

  // If there are any updated items, update appContext from stagedContent if available
  if (
    updatedTranslationData.updatedItems.length > 0 &&
    stagedContent.hasOwnProperty("appContext")
  ) {
    updatedTranslationData.appContext = stagedContent.appContext;
  }

  return updatedTranslationData;
};

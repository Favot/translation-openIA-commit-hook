import * as shell from "shelljs";
import {
  compareAndCaptureUpdates,
  getChangedFiles,
  getFileContent,
} from "./utils";

const main = () => {
  const files = getChangedFiles();

  for (const file of files) {
    if (shell.test("-f", file)) {
      const stagedContent = getFileContent("", file);
      const headContent = getFileContent("HEAD", file);

      const updatedTranslationData = compareAndCaptureUpdates(
        stagedContent,
        headContent
      );

      if (updatedTranslationData.updatedItems.length > 0) {
        console.log(updatedTranslationData);
      }
    }
  }
};

main();

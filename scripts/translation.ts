import { getChangedFiles, processFile } from "./utils";

const main = () => {
  const files = getChangedFiles();

  files.forEach((file) => {
    const updatedTranslationData = processFile(file);

    if (updatedTranslationData?.updatedItems.length > 0) {
      console.log(updatedTranslationData);
    } else {
      console.log("No updates found");
    }
  });
};

main();

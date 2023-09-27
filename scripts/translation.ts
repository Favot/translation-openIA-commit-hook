import * as shell from "shelljs";

// Adjusted command to match the correct directory structure
const command =
  'git diff-index --name-only --cached --diff-filter=d HEAD | grep -E "^src/localization/translations/.*[a-z]{2}(-[a-z]{2})?\\.json$"';

const result = shell.exec(command, { silent: true });

if (result.code !== 0) {
  console.log("No translation file change detected");
  process.exit(0);
}

const files = result.stdout.trim().split("\n");

const items: Record<string, any> = {};

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

    // Compare the staged content with the content in HEAD to find updated keys
    for (const [key, value] of Object.entries(stagedContent)) {
      if (!headContent.hasOwnProperty(key) || headContent[key] !== value) {
        items[key] = value;
      }
    }
  }
}

console.log("🚀 ~ file: translation.ts:18 ~ items:", items);

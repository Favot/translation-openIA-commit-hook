# Translation Updater Test App

This application serves as a testing ground for updating translation files upon each commit. It leverages the OpenAI API to translate updated content into multiple languages and then integrates the translated content back into the respective JSON files.

## Overview

The application detects changes in translation files and sends the updated content to OpenAI for translation into specified languages: German (de), French (fr), and English (US) (gb-us). The translated content is then parsed, and the corresponding JSON files are updated or created if necessary.

## Key Features

- **Change Detection**: Identifies changes in translation files located in the `src/localization/translations` directory.
- **OpenAI Integration**: Uses OpenAI API to translate the updated content into multiple languages.
- **File Update**: If the translation key already exists, the application updates it; if not, it creates a new key with the translated content.
- **Error Handling**: Manages errors gracefully, logging relevant information for troubleshooting.

## Code Overview

### Main Functionality

The main functionality resides in the `main` function, which executes the following steps:

1. **Get Changed Files**: Identify and retrieve the list of changed translation files.
2. **Process Files**: For each changed file, process and send the updated content for translation.
3. **Request Translation**: Formulate a translation request and send it to OpenAI.
4. **Parse Response**: Parse the translation response and update the translation data accordingly.
5. **Update JSON Files**: For each language, update or create the necessary translation keys in the respective JSON files.

### Error Handling

The application incorporates error handling to manage undefined properties and ensure that the translation process is not interrupted by unexpected issues. This includes checking whether translations exist for each specified language and logging any discrepancies for further investigation.

## Usage

To use this application, follow the steps below:

1. **Clone the Repository**: Clone the application repository to your local machine.
2. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies.
3. **Set Up OpenAI API Key**: Ensure that your OpenAI API key is correctly configured.
4. **Run the Application**: Execute the main function to start the application and test the translation update process.

## Example Output

The application will generate translations for the updated content and integrate them into the JSON files as shown below:

```json
{
  "de": [
    {
      "screenName": "welcomeScreen",
      "translationKey": "description",
      "updatedTranslation": "Dies ist die Beschreibung des Begrüßungsbildschirms für den Fußball"
    }
    // More translations...
  ],
  "fr": [
    // Translations for French...
  ],
  "gb-us": [
    // Translations for English (US)...
  ]
}
```

## Conclusion

The Translation Updater Test App demonstrates how to automate the process of updating translation files using OpenAI. It identifies changes, requests translations, and updates the necessary files, serving as a practical example for integrating translation updates into your development workflow.

# CSV Dictionary Application

## Overview
This application allows users to upload a CSV file, which is parsed into key-value pairs (such as word-translation pairs). Users can then search for specific words or phrases, and the app will display the corresponding results based on the data in the CSV file.

## Features
- **CSV File Upload**: The user can upload a CSV file that contains dictionary items in a key-value format (e.g., word-translation pairs).
- **Search Functionality**: The user can search for a word or phrase, and the application will display all matching results from the loaded dictionary.
- **CSV File Parsing**: The app automatically detects the delimiter (comma or semicolon) and parses the CSV file accordingly.
- **Local Storage**: The app saves the loaded dictionary to `localStorage`, allowing the user to reload the most recent dictionary without uploading the CSV again.
- **Error Handling**: The app provides user-friendly error messages when file loading or searching fails.

## How It Works
### 1. **File Upload and Parsing**
- The user selects a CSV file using the file input element (`#csvFileInput`).
- When the user clicks the "Read File" button (`#readFileButton`), the app reads the file and parses its content into key-value pairs.
- The CSV file should have rows where each row contains a key (e.g., word) followed by one or more values (e.g., translations), separated by a comma or semicolon.
- The delimiter is automatically detected by the app.

### 2. **Saving and Loading Data**
- After parsing the CSV file, the dictionary items are saved to the browser's `localStorage` under a key defined in the configuration file (`LOCAL_STORAGE_ITEM_KEY`).
- When the app is loaded, it tries to load the most recent dictionary from `localStorage`, allowing the user to resume their session without re-uploading the CSV file.

### 3. **Search Functionality**
- The user types a query into the search input field (`#searchInput`).
- The app listens for changes to the input and searches the dictionary for matches (either in the keys or values).
- Results are displayed in real-time, with a visual format that clearly separates the key and value using a divider (e.g., `~`).

### 4. **Displaying Results**
- The app formats the results and injects them into the HTML element (`#searchResult`).
- If no matches are found, an appropriate message is displayed.

### 5. **Error Handling**
- The app handles common errors, such as issues with file reading, empty CSV files, or malformed data, by displaying error messages to the user.
- Errors are logged to the console for debugging.

## Code Structure
- **Event Handling**: The `attachEventHandlers` function attaches the necessary event listeners to the file upload button and the search input field.
- **CSV Parsing**: The `parseCSVContent` function handles parsing the CSV file and converting each row into a key-value pair.
- **Search Logic**: The `searchTranslations` function performs the actual search, filtering dictionary items based on the user's query.
- **Result Rendering**: The `renderResults` function formats and displays the search results in HTML.

## Configuration
- **`app-config.js`**: This external configuration file contains several constants such as:
  - `LOCAL_STORAGE_ITEM_KEY`: The key under which dictionary items are saved in localStorage.
  - `MAX_RESULTS`: The maximum number of results displayed to the user.
  - `MAX_SEPARATOR_DETECTING_DATA`: The portion of the CSV file used to detect the delimiter.
  - `ROWS_SEPARATOR`: The character used to separate rows in the CSV file.

## How to Use
1. Upload a CSV file with dictionary data.
2. Search for words or translations in the search bar.
3. View results as they appear, or load the last uploaded file from localStorage.

### Dependencies
The app requires a browser environment that supports:
- File API for reading CSV files.
- LocalStorage API for saving and retrieving dictionary data.
- Basic HTML manipulation via the DOM.

## Error Handling
The app includes several mechanisms to handle errors:
- **File not selected**: Alerts the user to upload a file before reading.
- **LocalStorage errors**: If an error occurs while saving or loading data from localStorage, a relevant error message is displayed.

## Conclusion
This CSV Dictionary Application is designed to allow users to easily upload a CSV dictionary file, search for translations, and view results. It efficiently saves user data using `localStorage` and handles common errors gracefully.
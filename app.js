import * as config from "./app-config.js";

let dictionaryItems = [];

const fileInputEl = document.getElementById("csvFileInput");
const searchResultEl = document.getElementById("searchResult");
const searchInputEl = document.getElementById("searchInput");
const readFileButtonEl = document.getElementById("readFileButton");
const textTransformSwitchEl = document.getElementById("textTransformSwitch");

const textTransformOptions = ["none", "lowercase", "uppercase"];
let selectedtextTransformOption = 0;

// Switches text transform class
const onTextTransformSwitchClick = async (event) => {
  onKeyValueClick(event);

  document.body.classList.remove(
    textTransformOptions[selectedtextTransformOption]
  );

  selectedtextTransformOption = (selectedtextTransformOption + 1) % 3;

  document.body.classList.add(
    textTransformOptions[selectedtextTransformOption]
  );
};

// Copies to clipboard the clicked key or value text
const onKeyValueClick = async (event) => {
  try {
    const elClasses = event?.target?.classList;
    if (elClasses.contains("k") || elClasses.contains("v")) {
      const text = event?.target?.innerText;
      console.log(`click -> copy -> ${text}`);

      navigator.clipboard.writeText(text);
      event.target.classList.add("clicked-text");

      setTimeout(() => {
        event.target.classList.remove("clicked-text");
      }, 500);
    }
  } catch (e) {
    console.error(e);
  }
};

// Attach event hadlers
const attachEventHandlers = () => {
  searchInputEl.addEventListener("change", searchTranslations);
  searchInputEl.addEventListener("keyup", searchTranslations);
  readFileButtonEl.addEventListener("click", onReadCsvFileClick);
  searchResultEl.addEventListener("click", onKeyValueClick);
  textTransformSwitchEl.addEventListener("click", onTextTransformSwitchClick);
};

// Try to load the dictionary from localStorage if available
const tryLoadRecentDict = async () => {
  try {
    const storedItems = localStorage.getItem(config.LOCAL_STORAGE_ITEM_KEY);
    if (storedItems) {
      dictionaryItems = JSON.parse(storedItems);
      setResultText(`${dictionaryItems.length} lines loaded!`);
    } else {
      setResultText("Start by selecting a CSV file.");
    }
  } catch (error) {
    handleError("Error loading dictionary from localStorage", error);
  }
};

// Handle CSV file load and store the parsed content
const onCsvFileLoad = (event) => {
  const csvContent = event.target.result;
  const parsedItems = parseCSVContent(csvContent);

  if (parsedItems.length > 0) {
    dictionaryItems = parsedItems;
    saveDictionaryItems();
    setResultText(`${dictionaryItems.length} lines loaded!`);
  } else {
    setResultText("No valid entries found in the CSV file.");
  }
};

// Handle file selection and reading
const onReadCsvFileClick = () => {
  const selectedFile = fileInputEl?.files?.[0];
  if (!selectedFile) {
    alert("Please select a CSV file first.");
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = onCsvFileLoad;
  fileReader.readAsText(selectedFile);
};

// Detect CSV delimiter (comma or semicolon)
const detectSeparator = (data = "") => {
  const snippet = data.slice(0, config.MAX_SEPARATOR_DETECTING_DATA);
  const commaCount = (snippet.match(/,/g) || []).length;
  const semicolonCount = (snippet.match(/;/g) || []).length;

  const result = commaCount > semicolonCount ? "," : ";";

  return result;
};

// Convert a row into a key-value object
const rowToDictRecordObj = (row = "", separator = ",") => {
  const [key, ...values] = row.split(separator).map((item) => item.trim());

  if (!key || values.length === 0) {
    return null;
  }

  const value = values.filter(Boolean).join("; ");
  return { key, value };
};

// Parse CSV content into key-value pairs
const parseCSVContent = (data = "") => {
  const separator = detectSeparator(data);
  const rows = data.split(config.ROWS_SEPARATOR);

  const result = rows
    .map((row) => rowToDictRecordObj(row, separator))
    .filter(Boolean);

  return result;
};

// Get search query from input
const getSearchQuery = () => {
  const result = searchInputEl?.value?.trim().toLowerCase() || "";
  return result;
};

// Set the result text to the searchResultEl
const setResultText = (text = "") => {
  searchResultEl.innerHTML = text;
};

// Save dictionary items to localStorage
const saveDictionaryItems = () => {
  try {
    localStorage.setItem(
      config.LOCAL_STORAGE_ITEM_KEY,
      JSON.stringify(dictionaryItems, null, 2)
    );
  } catch (error) {
    handleError("Error saving dictionary to localStorage", error);
  }
};

// Handle errors
const handleError = (message, error) => {
  console.error(message, error);
  alert(message);
};

// Utility function to escape HTML special characters
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const divider = "~";

// Renders key/value pair as html string
const keyValueToHtmlString = ({ key, value }) => {
  let valuesStrings = escapeHtml(value).split(";");
  let valuesHtml = valuesStrings.join(
    `</span><span class="d">;</span><span class="v">`
  );

  return `<div class="r">
            <span class="k">${escapeHtml(key)}</span>
            <span class="d">${divider}</span>
            <span class="v">${valuesHtml}</span>
          </div>`;
};

// Renders all results as html
const renderResults = (results) => {
  const formattedResults = results.map(keyValueToHtmlString).join("\n");
  setResultText(formattedResults);
};

// Search translations from the loaded dictionary
const searchTranslations = () => {
  const searchQuery = getSearchQuery();

  if (!dictionaryItems.length) {
    setResultText("Please load a CSV file first.");
    return;
  }

  if (!searchQuery) {
    setResultText("Please enter a word to search.");
    return;
  }

  if (searchQuery.length < 2) {
    setResultText("Please enter at least 2 characters.");
    return;
  }

  const results = dictionaryItems.filter(
    ({ key, value }) =>
      key.toLowerCase().includes(searchQuery) ||
      value.toLowerCase().includes(searchQuery)
  );

  if (!results.length) {
    setResultText("No matches found.");
    return;
  }

  if (results.length > config.MAX_RESULTS) {
    setResultText(`Too many results! (${results.length})`);
    return;
  }

  renderResults(results);
};

const app = {
  attachEventHandlers,
  onReadCsvFileClick,
  searchTranslations,
  tryLoadRecentDict,
};

export { app };

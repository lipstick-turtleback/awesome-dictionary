function getApp() {
  let dictionaryItems = [];

  const ROWS_SEPARATOR = "\n";
  const MAX_RESULTS = 99;
  const MAX_SEPARATOR_DETECTING_DATA = 9999;
  const LOCAL_STORAGE_ITEM_KEY = "recentDictionaryItems";

  const fileInputEl = document.getElementById("csvFileInput");
  const searchResultEl = document.getElementById("searchResult");
  const searchInputEl = document.getElementById("searchInput");

  // Try to load the dictionary from localStorage if available
  const tryLoadRecentDict = async () => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_ITEM_KEY);
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
    const snippet = data.slice(0, MAX_SEPARATOR_DETECTING_DATA);
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
    const rows = data.split(ROWS_SEPARATOR);

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
    searchResultEl.textContent = text;
  };

  // Save dictionary items to localStorage
  const saveDictionaryItems = () => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_ITEM_KEY,
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

    if (results.length > MAX_RESULTS) {
      setResultText(`Too many results! (${results.length})`);
      return;
    }

    const formattedResults = results
      .map(({ key, value }) => `${key} => ${value}`)
      .join("\n\n");

    setResultText(formattedResults);
  };

  return {
    onReadCsvFileClick,
    searchTranslations,
    tryLoadRecentDict,
  };
}

// Initialize app
const app = getApp();
app.tryLoadRecentDict();

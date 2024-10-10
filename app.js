function getApp() {
  let dictionaryItems = [];

  const fileInputEl = document.getElementById("csvFileInput");
  const searchResultEl = document.getElementById("searchResult");
  const searchInputEl = document.getElementById("searchInput");

  // Try to load the dictionary from localStorage if available
  const tryLoadRecentDict = async () => {
    try {
      const storedItems = window.localStorage?.getItem("recentDictionaryItems");
      if (storedItems) {
        dictionaryItems = JSON.parse(storedItems);
        setResultText(`${dictionaryItems.length} lines loaded!`);
      } else {
        setResultText("Start by selecting a CSV file.");
      }
    } catch (e) {
      console.error("Error loading dictionary from localStorage:", e);
      alert("Failed to load previously used dictionary data.");
    }
  };

  // Handle CSV file load
  const onCsvFileLoad = (event) => {
    const csvContent = event.target.result;

    dictionaryItems = parseCSVContent(csvContent);

    if (dictionaryItems.length > 0) {
      const serializedItems = JSON.stringify(dictionaryItems, null, 2);
      window.localStorage?.setItem("recentDictionaryItems", serializedItems);
      setResultText(`${dictionaryItems.length} lines loaded!`);
    } else {
      setResultText("No valid entries found in the CSV file.");
    }
  };

  // Handle file selection and reading
  const onReadCsvFileClick = () => {
    if (!fileInputEl.files.length) {
      alert("Please select a CSV file first.");
      return;
    }

    const selectedFile = fileInputEl.files[0];
    const fileReader = new FileReader();
    fileReader.onload = onCsvFileLoad;
    fileReader.readAsText(selectedFile);
  };

  const lineSeparator = "\n";

  const calcSeparatorChar = (data = "") => {
    let x = data;
    if (x.length > 9999) {
      x = x.substring(0, 9999);
    }

    let c1 = x.split(",").length;
    let c2 = x.split(";").length;

    let itemsSeparator = c1 > c2 ? "," : ";";

    return itemsSeparator;
  };

  const parseCSVContent = (data = "") => {
    let result = [];

    let itemsSeparator = calcSeparatorChar(data);
    const rows = data.split(lineSeparator);

    rows.forEach((row) => {
      const lineItems = row.split(itemsSeparator);
      if (lineItems.length > 1) {
        const key = lineItems[0].trim();
        lineItems.shift();
        let allValuesString = lineItems
          .map((x) => x.trim())
          .filter((x) => !!x)
          .join("; ")
          .trim();
        const value = allValuesString;
        result.push({ key, value });
      }
    });

    return result;
  };

  // Get search query from input
  const getSearchQuery = () => searchInputEl.value?.trim().toLowerCase() || "";

  // Set the result text to the searchResultEl
  const setResultText = (text = "") => {
    searchResultEl.textContent = text;
  };

  // Search translations from the loaded dictionary
  const searchTranslations = () => {
    const searchString = getSearchQuery();

    if (!dictionaryItems.length) {
      setResultText("Please load a CSV file first.");
      return;
    }

    if (!searchString) {
      setResultText("Please enter a word to search.");
      return;
    }

    if (searchString.length < 2) {
      setResultText("Please enter at least 2 characters.");
      return;
    }

    const matchingTranslations = dictionaryItems.filter(
      ({ key, value }) =>
        key.toLowerCase().includes(searchString) ||
        value.toLowerCase().includes(searchString)
    );

    if (!matchingTranslations.length) {
      setResultText("No matches found.");
    } else if (matchingTranslations.length > 99) {
      setResultText(`Too many results! (${matchingTranslations.length})`);
    } else {
      const resultText = matchingTranslations
        .map(({ key, value }) => `${key} => ${value}`)
        .join("\n\n");

      setResultText(resultText);
    }
  };

  const result = {
    onReadCsvFileClick,
    searchTranslations,
    tryLoadRecentDict,
  };

  return result;
}

const app = getApp();
app.tryLoadRecentDict();

function getApp() {
  let dictionaryItems = [];

  const fileInputEl = document.getElementById("csvFileInput");
  const searchResultEl = document.getElementById("searchResult");
  const searchInputEl = document.getElementById("searchInput");

  const onReadCsvFileClick = () => {
    if (fileInputEl.files.length === 0) {
      alert("Please select a CSV file first.");
      return;
    }

    const firstSelectedFile = fileInputEl.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      const csvFileContent = event.target.result;
      dictionaryItems = parseFullCSVContent(csvFileContent);
      searchResultEl.textContent = "";
    };

    fileReader.readAsText(firstSelectedFile);
  };

  const parseFullCSVContent = (data = "") => {
    let result = [];

    let c1 = data.split(",").length;
    let c2 = data.split(";").length;

    let itemsSeparator = c1 > c2 ? "," : ";";
    const lineSeparator = "\n";

    const rowsStrings = data.split(lineSeparator);

    rowsStrings.forEach((row) => {
      const lineItems = row.split(itemsSeparator);
      if (lineItems.length > 1) {
        const key = lineItems[0].trim();
        const value = lineItems[1].trim();
        result.push({ key, value, searchString: `${key} ${value}` });
      }
    });

    alert(`${result.length} records parsed!`);

    return result;
  };

  const getSearchString = () => {
    let searchString = searchInputEl.value?.trim().toLowerCase();
    return searchString;
  };

  const searchTranslations = () => {
    let searchString = getSearchString();

    if (dictionaryItems.length <= 0) {
      searchResultEl.textContent = "Please load csv file first.";
      return;
    }

    if (searchString === "") {
      searchResultEl.textContent = "Please enter a word to search.";
      return;
    }

    if (searchString.length < 2) {
      searchResultEl.textContent = "Please enter at least 3 chars.";
      return;
    }

    const translations = dictionaryItems.filter(
      (x) => x.searchString.indexOf(searchString) >= 0
    );

    if (translations.length < 49) {
      let translationsString = translations
        .map((x) => `${x.key} => ${x.value}`)
        .join("\n\n");

      searchResultEl.textContent = `${translationsString}`;
    }
  };

  const result = {
    onReadCsvFileClick,
    searchTranslations,
  };

  return result;
}

const app = getApp();

function getApp() {
  let dictionaryItems = [];

  const fileInputEl = document.getElementById("csvFileInput");
  const searchResultEl = document.getElementById("searchResult");
  const searchInputEl = document.getElementById("searchInput");

  const tryLoadRecentDict = async () => {
    try {
      let str = window.localStorage?.getItem("recentDictionaryItems");
      let resoredObj = JSON.parse(str);
      dictionaryItems = resoredObj;
      setResultText(`${dictionaryItems.length} lines loaded!`);
    } catch (e) {
      console.log(e);
      alert("Loading of the previously used dictionary data has failed :(");
    }
  };

  const fileReaderOnLoad = (event) => {
    const csvFileContent = event.target.result;

    dictionaryItems = parseFullCSVContent(csvFileContent);

    let dis = JSON.stringify(dictionaryItems, null, 2);
    window.localStorage?.setItem("recentDictionaryItems", dis);

    setResultText(`${dictionaryItems.length} lines loaded!`);
  };

  const onReadCsvFileClick = () => {
    if (fileInputEl.files.length === 0) {
      alert("Select a CSV file first!");
      return;
    }

    const firstSelectedFile = fileInputEl.files[0];
    const fileReader = new FileReader();
    fileReader.onload = fileReaderOnLoad;
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

  const getSearchString = () => {
    let searchString = searchInputEl.value?.trim().toLowerCase();
    return searchString;
  };

  const setResultText = (resultString = "") => {
    searchResultEl.textContent = resultString;
  };

  const searchTranslations = () => {
    let searchString = getSearchString();

    if (dictionaryItems.length <= 0) {
      setResultText("Please load csv file first.");
      return;
    }

    if (searchString === "") {
      setResultText("Please enter a word to search.");
      return;
    }

    if (searchString.length < 2) {
      setResultText("Please enter at least 3 chars.");
      return;
    }

    const translations = dictionaryItems.filter(
      (x) =>
        x.key.indexOf(searchString) >= 0 || x.value.indexOf(searchString) >= 0
    );

    if (translations.length < 99) {
      let result = translations
        .map((x) => `${x.key} => ${x.value}`)
        .join("\n\n");

      setResultText(result);
    }

    if (translations.length > 99) {
      setResultText(`Too many results! (${translations.length})`);
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

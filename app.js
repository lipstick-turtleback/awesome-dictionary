function getApp() {
  let parsedDictionary = [];

  const fileInput = document.getElementById("csvFileInput");
  const searchResult = document.getElementById("searchResult");
  const searchInput = document.getElementById("searchInput");

  const loadCSV = () => {
    console.log("loadCSV start");

    if (fileInput.files.length === 0) {
      alert("Please select a CSV file first.");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const csvData = event.target.result;
      parsedDictionary = parseCSV(csvData);
      searchResult.textContent = "";
    };

    reader.readAsText(file);

    console.log("loadCSV end");
  };

  const parseCSV = (data) => {
    console.log("parse csv start");

    const rows = data.trim().split("\n");
    const dictionary = [];

    rows.forEach((row) => {
      const [key, value] = row.split(",").map((item) => item.trim());
      dictionary.push({ key, value, searchString: `${key} ${value}` });
    });

    console.log("parse csv end");

    alert(`${dictionary.length} records parsed!`);

    return dictionary;
  };

  const searchWord = () => {
    let searchString = searchInput.value.trim().toLowerCase();

    if (parsedDictionary.length <= 0) {
      searchResult.textContent = "Please load csv file first.";
      return;
    }

    if (searchString === "") {
      searchResult.textContent = "Please enter a word to search.";
      return;
    }

    if (searchString.length < 2) {
      searchResult.textContent = "Please enter at least 3 chars.";
      return;
    }

    const translations = parsedDictionary.filter(
      (x) => x.searchString.indexOf(searchString) >= 0
    );

    if (translations.length < 29) {
      let translationsString = translations
        .map((x) => `${x.key} => ${x.value}`)
        .join("\n");

      searchResult.textContent = `${translationsString}`;
    }
  };

  const result = {
    loadCSV,
    parseCSV,
    searchWord,
  };

  return result;
}

const app = getApp();

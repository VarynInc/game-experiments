/**
 * Wordy things.
 */
import {WordSearch} from "./WordSearch.js";

const wordSearch = new WordSearch();
const dictionaryURL = "./full-dictionary.txt";

function showPage() {
    const appDiv = document.getElementById("appDiv");

    wordSearch.loadDictionary(dictionaryURL)
    .then(function() {
        const results = wordSearch.find("cl???");
        if (results == null) {
            appDiv.innerHTML = "<div><h3>Error</h3><p>No dictionary has been loaded, cannot find words.</p></div>";
        } else {
            const wordList = results.map(function(word) {
                return `<li>${word}</li>`;
            }).join("");
            appDiv.innerHTML = "<div><h3>Words</h3><ul>" + wordList + "</ul></div>";
        }
    })
    .catch(function(error) {
        appDiv.innerHTML = "<div><h3>Error</h3><p>" + error.toString() + "</p></div>";
    });
}

showPage();

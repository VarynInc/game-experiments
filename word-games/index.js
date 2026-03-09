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
        const submitButton = document.getElementById("search");
        submitButton.addEventListener("click", function (submitEvent) {
            submitEvent.preventDefault();
            const template = document.getElementById("template").value;
            const include = document.getElementById("include").value;
            const exclude = document.getElementById("exclude").value;

            const results = wordSearch.find(template);
            if (results == null) {
                appDiv.innerHTML = "<div><h3>Error</h3><p>No dictionary has been loaded, cannot find words.</p></div>";
            } else {
                let wordCount = 0;
                const wordList = results.map(function(word) {
                    if (exclude.length > 0) {
                        // if word includes any of these letters then do not add it
                        const excludeList = exclude.split("");
                        for (let i = 0; i < excludeList.length; i += 1) {
                            if (word.includes(excludeList[i])) {
                                return;
                            }
                        }
                    }
                    if (include.length > 0) {
                        // if word includes any of these letters then add it
                        const includeList = include.split("");
                        for (let i = 0; i < includeList.length; i += 1) {
                            if (word.includes(includeList[i])) {
                                break;
                            }
                            return;
                        }
                    }
                    wordCount += 1;
                    return `<li>${word}</li>`;
                }).join("");
                appDiv.innerHTML = `<div><h3>${wordCount} words match</h3><ul>${wordList}</ul></div>`;
            }
        });
    })
    .catch(function(error) {
        appDiv.innerHTML = "<div><h3>Error</h3><p>" + error.toString() + "</p></div>";
    });
}

showPage();

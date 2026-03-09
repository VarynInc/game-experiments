class WordSearch {

    constructor (pathToDictionary) {
        this.dictionary = null;
        this.loading = false;
        if (pathToDictionary) {
            this.loadDictionary(pathToDictionary);
        }
    }

    loadDictionary (pathToDictionary) {
        const context = this;
        context.dictionary = null;
        context.loading = true;

        return new Promise(function(resolve, reject) {
            fetch(pathToDictionary)
            .then(function(response) {
                return response.text();
            })
            .then(function(dictionaryText) {
                context.dictionary = dictionaryText;
                context.loading = false;
                resolve();
            })
            .catch(function(error) {
                context.loading = false;
                reject(error);
            });
        });
    }

    /**
     * Find words that match a word template. The template is a type of regex style pattern used to
     * identify the type of word pattern you are searching for. Examples:
     * - `a????`: match 5-letter words that begin with `a`.
     * - `cle[atb][rhs]??`: match 7-letter words beginning with `cle`, and have only the matched letters in positions 4 and 5, followed by any 2 letters.
     *
     * @param {string} wordTemplate A regex style template used to describe the word pattern you are looking for.
     * @returns {Array} A list of words matching your `wordTemplate` pattern.
     */
    find (wordTemplate) {
        if (this.dictionary == null || this.loading) {
            return null;
        }
        const regexTemplate = wordTemplate.toLocaleLowerCase().replace(/\?/g, "[a-z]");
        let results = [];
        const re = new RegExp(`^${regexTemplate}$`, "gm");
        const matches = this.dictionary.match(re);
        results = results.concat(matches);
        return results;
    }

    /**
     * Similar to `find()` but returns the count of matching words.
     *
     * @param {string} wordTemplate A regex style template used to describe the word pattern you are looking for.
     * @returns {integer} A count of the number of matching words in the dictionary.
     */
    count (wordTemplate) {
        const wordList = this.find(wordTemplate);
        return wordList.length;
    }

    /**
     * Generate a new dictionary file of a subset of the master dictionary according
     * to the options requested.
     *   wordsOfLength: {integer} Generated dictionary contains only words of the specified length.
     * @param {object} options Set options to indicate how to generate a dictionary.
     */
    generateDictionary (options) {
        if (options.wordsOfLength > 0) {
            // generate a dictionary using only words of the requested length
        }
    }
}

export { WordSearch };

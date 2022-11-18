class WordSearch {

    constructor () {
        this.dictionary = null;
        this.loading = false;
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
     * - `?le*`: match words of any length that begin with any letter and have `l` as the second and `e` as the third letter.
     * - `cle[atb][rhs]??`: match 7-letter words beginning with `cle`, and have only the matched letters in positions 4 and 5, followed by any 2 letters.
     *
     * @param {string} wordTemplate A regex style template used to describe the word pattern you are looking for.
     * @returns {Array} A list of words matching your `wordTemplate` pattern.
     */
    find (wordTemplate) {
        if (this.dictionary == null || this.loading) {
            return null;
        }
        let results = [];
        results.push("words");
        results.push("clear");
        results.push("album");
        return results;
    }

    /**
     * Similar to `find()` but returns the count of matching words.
     *
     * @param {string} wordTemplate A regex style template used to describe the word pattern you are looking for.
     * @returns {integer} A count of the number of matching words in the dictionary.
     */
    count (wordTemplate) {
        if (this.dictionary == null || this.loading) {
            return -1;
        }
        return 22;
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

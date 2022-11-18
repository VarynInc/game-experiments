class DictionaryBuilder {

    constructor() {
        this.dictionary = null;
        this.loading = false;
    }

    /**
     * Load a dictionary in memory so that it can be processed. Loading is asynchronous and
     * takes a while, the resolve function is called once the dictionary is loaded in memory.
     *
     * @param {string} pathToDictionary The path/URL to the master dictionary file to load.
     * @returns {Promise} The resolve function is called once the dictionary is loaded in memory.
     */
    loadDictionary(pathToDictionary) {
        const context = this;
        context.dictionary = [];
        context.loading = true;

        return new Promise(function(resolve, reject) {
            context.loading = false;
            resolve();
        });
    }

    /**
     * Scan the master dictionary and create a new dictionary file with only the words
     * of the specified length. For example, create a dictionary with only 7-letter words.
     * You must call `loadDictionary()` first.
     *
     * @param {integer} wordLength Save only words of the specified length.
     * @param {string} fileName Write to the file path specified.
     */
    saveWithWordLength(wordLength, fileName) {

    }

    /**
     * Scan the master dictionary and create a set of new dictionary files with separate files
     * based on the first letter of each word. You must call `loadDictionary()` first.
     *
     * @param {string} fileName Write to the file path specified, with each file suffixed with `-letter`.
     */
    saveWithStartLetter(fileName) {

    }
}

export { DictionaryBuilder };

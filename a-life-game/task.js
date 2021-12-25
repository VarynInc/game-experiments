/**
 * Define a task. This is designed to be a base class and individual
 * tasks should be extended from this class to perform specific tasks.
 */
class Task {
    constructor (properties) {
        this.properties = properties;
    }

    /**
     * Run task.
     * @param {Cell} cell Cell object
     * @param {TickEvent} tick Tick event object.
     */
    run(cell, tick) {
        console.log(`Running ${cell.id} at tick ${tick}`);
    }
}
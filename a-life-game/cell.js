/**
 * Define a cell lifespan.
 */
class Cell {

    /**
     * Cell properties
     */
    id = 0;
    taskList = null;
    birthDate = null;
    life = 0;
    health = 0;
    age = 0;

    /**
     * Birth a new cell. Each cell should have a unique identifier.
     * @param {integer} id A unique id to assign to this cell.
     */
    constructor (id) {
        this.id = id;
        this.taskList = [];
        this.birthDate = Date.now();
        this.life = 1;
        this.health = 0;
        this.age = 0;
    }

    /**
     * The cell dies.
     */
    die() {
        this.life = 0;
        this.health = 0;
        this.taskList = null;
    }

    /**
     * Assign the cell something to do.
     * @param {Task} task A Task object to add.
     */
    assignTask(task) {
        this.taskList.push(task);
    }

    /**
     * Unassign the cell a previously assigned task.
     * @param {Task} task A Task object to remove.
     */
     unassignTask(task) {
        // this.taskList.push(task);
    }

    /**
     * The cell performs a clock tick update of its internal state.
     * @param {TickEvent} tick Tick event object.
     */
    update(tick) {
        this.age += 1;
        this.taskList.forEach(task => {
            this.performTask(task, tick);
        });
    }

    /**
     * The cell performs a task.
     * @param {object} task Task object,
     * @param {TickEvent} tick Tick event object.
     */
    performTask(task, tick) {
        if (typeof task.run == "function" && this.life > 0) {
            task.run(this, tick);
        }
    }
}
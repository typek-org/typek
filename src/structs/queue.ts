/**
 * A queue of items. You can add items to the back end of the queue,
 * peek items at the front end of the queue, and pop items from the
 * front of the queue.
 */
export class Queue<T> {
  private queue: T[] = [];

  /**
   * The number of items in the queue.
   */
  get size(): number {
    return this.queue.length;
  }

  /**
   * Adds a new item to the back end of the queue.
   */
  enqueue(item: T): void {
    this.queue.push(item);
  }

  /**
   * Returns the frontmost item without modifying the queue.
   */
  peek(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this.queue[0];
  }

  /**
   * Returns all the items of the queue as an array,
   * the frontmost items first. The queue is not modified.
   */
  peekAll(): T[] {
    return this.queue.slice();
  }

  /**
   * Returns the frontmost item and removes it from the queue.
   */
  dequeue(): T | undefined {
    return this.queue.shift();
  }
}

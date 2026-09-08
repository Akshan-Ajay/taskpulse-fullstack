// src/eventRouter.js

/**
 * Event hub for routing view state and cross-component signaling.
 */
export const viewEvents = {
  listeners: [],

  /**
   * Subscribe to view changes.
   * @param {Function} callback Function receiving { view, data }
   * @returns {Function} Unsubscribe cleanup function
   */
  subscribe(callback) {
    if (typeof callback !== "function") return () => {};
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  },

  /**
   * Trigger a view change overlay/navigation.
   * @param {string|Object} viewName View key or route object
   * @param {Object|null} taskData Associated task payload
   */
  setView(viewName, taskData = null) {
    const payload =
      typeof viewName === "object" && viewName !== null
        ? { view: viewName.view || "dashboard", data: viewName.data || null }
        : { view: viewName, data: taskData };

    this.listeners.forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.error("Error inside viewEvents listener:", err);
      }
    });
  },

  /**
   * Helper to dispatch custom view/card updates declaratively.
   * Replaces direct DOM query manipulation with state-friendly event delivery.
   * @param {string} action Action type (e.g., 'UPDATE', 'DELETE')
   * @param {Object} payload Event details
   */
  emit(action, payload = {}) {
    this.listeners.forEach((callback) => {
      try {
        callback({ action, ...payload });
      } catch (err) {
        console.error("Error dispatching event:", err);
      }
    });
  },
};
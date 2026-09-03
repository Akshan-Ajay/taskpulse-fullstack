// src/eventRouter.js

export const viewEvents = {
  listeners: [],
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  },
  setView(viewName, taskData = null) {
    this.listeners.forEach((callback) => callback({ view: viewName, data: taskData }));
  },

  updateTaskCard(taskTitle, updatedData) {
    if (typeof document === "undefined") return;
    const cards = Array.from(document.querySelectorAll(".task-card"));
    const targetCard = cards.find(
      (card) => card.querySelector(".task-title")?.textContent === taskTitle
    );

    if (targetCard) {
      if (updatedData.delete) {
        targetCard.remove();
        return;
      }
      if (updatedData.title) {
        const titleEl = targetCard.querySelector(".task-title");
        if (titleEl) titleEl.textContent = updatedData.title;
      }
    }
  },
};
// src/eventRouter.js

export const viewEvents = {
  listeners: [],
  subscribe(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(l => l !== callback); };
  },
  setView(viewName, taskData = null) {
    this.listeners.forEach(callback => callback({ view: viewName, data: taskData }));
  },
  
  // Custom action to update DOM elements directly
  updateTaskCard(taskTitle, updatedData) {
    if (typeof document === "undefined") return;
    const cards = Array.from(document.querySelectorAll('.task-card'));
    const targetCard = cards.find(card => card.querySelector('.task-title')?.textContent === taskTitle);
    
    if (targetCard) {
      if (updatedData.delete) {
        targetCard.remove();
        return;
      }
      if (updatedData.title) {
        const titleEl = targetCard.querySelector('.task-title');
        if (titleEl) titleEl.textContent = updatedData.title;
      }
      if (updatedData.priority) {
        const priorityEl = targetCard.querySelector('.priority-badge');
        if (priorityEl) {
          const dot = priorityEl.querySelector('.priority-dot');
          priorityEl.textContent = "";
          if (dot) priorityEl.appendChild(dot);
          priorityEl.append(` ${updatedData.priority}`);
        }
      }
    }
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("click", (e) => {
    try {
      // 1. Target the open icon wrapper
      const openDetailsBtn = e.target.closest('.open-icon');
      if (openDetailsBtn) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = openDetailsBtn.closest('.task-card');
        if (card) {
          const title = card.querySelector('.task-title')?.textContent || "Untitled Task";
          const priority = card.querySelector('.priority-badge')?.textContent?.trim() || "Medium";
          const dueDate = card.querySelector('.meta-item:not([title*="comments"])')?.textContent?.trim() || "No Date";
          
          // Grab dataset ID safely, with fallbacks to avoid undefined errors
          const taskId = card.dataset?.id || card.dataset?.taskId || card.getAttribute('data-id') || title;

          const tags = Array.from(card.querySelectorAll('.task-label')).map(el => el.textContent.trim());
          
          const avatarEl = card.querySelector('.task-avatar');
          const assigneeInitials = avatarEl?.textContent?.trim() || "??";
          const assigneeName = avatarEl?.getAttribute('title') || "Unassigned";

          viewEvents.setView("task-details", {
            id: taskId,
            title,
            priority,
            dueDate,
            tags,
            assignee: {
              name: assigneeName,
              initials: assigneeInitials
            }
          });
        }
        return;
      }

      // 2. Target the add task button
      const addBtn = e.target.closest('.add-task-btn');
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        viewEvents.setView("create-task");
        return;
      }
    } catch (err) {
      console.error("Error in eventRouter click handler:", err);
    }
  }, true);
}
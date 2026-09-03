import React, { useState, useEffect } from "react";
import TaskOverlayApp from "./TaskOverlayApp";

export default function ProtectedTaskOverlay({ initialView, taskData, onClose, isLoggedIn }) {
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");

  // Determine if the form should be hidden completely
  const isCreateBlocked = !isLoggedIn && initialView === "create-task";
  const shouldHideForm = !isLoggedIn && (isCreateBlocked || showAuthPrompt);

  // Intercept attempts to Edit or Delete inside task details view when logged out
  useEffect(() => {
    if (isLoggedIn) return;

    function handleProtectedClick(e) {
      const target = e.target.closest("button, [role='button'], a");
      if (!target) return;

      const btnText = target.textContent?.toLowerCase() || "";
      const ariaLabel = target.getAttribute("aria-label")?.toLowerCase() || "";
      const title = target.getAttribute("title")?.toLowerCase() || "";

      const isDelete =
        btnText.includes("delete") ||
        ariaLabel.includes("delete") ||
        title.includes("delete") ||
        target.querySelector("svg.lucide-trash") ||
        target.querySelector("svg.lucide-trash-2") ||
        target.classList.contains("btn-delete");

      const isEdit =
        btnText.includes("edit") ||
        ariaLabel.includes("edit") ||
        title.includes("edit") ||
        target.querySelector("svg.lucide-pencil") ||
        target.querySelector("svg.lucide-edit") ||
        target.classList.contains("btn-edit");

      if (isDelete || isEdit) {
        e.preventDefault();
        e.stopPropagation();

        setPromptMessage(
          isDelete
            ? "Please log in or register to delete tasks."
            : "Please log in or register to edit tasks."
        );
        setShowAuthPrompt(true);
      }
    }

    document.addEventListener("click", handleProtectedClick, true);
    return () => {
      document.removeEventListener("click", handleProtectedClick, true);
    };
  }, [isLoggedIn]);

  return (
    <>
      {/* 1. Force-hide TaskOverlayApp when a guest triggers restricted actions */}
      <div style={{ display: shouldHideForm ? "none" : "block" }}>
        <TaskOverlayApp
          initialView={initialView}
          taskData={taskData}
          onClose={onClose}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* 2. Show ONLY the Auth Modal for restricted actions */}
      {shouldHideForm && (
        <AuthPromptModal
          onClose={onClose}
          title="Login Required"
          message={
            isCreateBlocked
              ? "Please log in or register to create new tasks."
              : promptMessage
          }
        />
      )}
    </>
  );
}

export function AuthPromptModal({ onClose, title, message }) {
  // Directly closes the overlay back to dashboard
  const handleGoBack = () => {
    onClose();
  };

  const handleOpenAuth = (type) => {
    // Close overlay completely to reveal dashboard
    onClose();

    // Trigger Navbar action
    setTimeout(() => {
      const navButtons = Array.from(
        document.querySelectorAll("nav button, header button, .navbar button")
      );
      const targetBtn = navButtons.find((b) => b.textContent?.trim() === type);

      if (targetBtn) {
        targetBtn.click();
      } else {
        const allButtons = Array.from(document.querySelectorAll("button"));
        const fallbackBtn = allButtons.find((b) => b.textContent?.trim() === type);
        if (fallbackBtn) fallbackBtn.click();
      }
    }, 50);
  };

  return (
    <div style={styles.overlay} onClick={handleGoBack}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#4c1d95", margin: "0 0 12px 0", fontSize: "1.25rem" }}>
          {title}
        </h2>
        <p style={{ color: "#4a3b69", marginBottom: "24px", fontSize: "0.95rem" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button style={styles.cancelBtn} onClick={handleGoBack}>
            Back
          </button>
          <button style={styles.ghostBtn} onClick={() => handleOpenAuth("Login")}>
            Login
          </button>
          <button style={styles.primaryBtn} onClick={() => handleOpenAuth("Register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(37, 16, 60, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999,
    backdropFilter: "blur(12px)",
  },
  modalCard: {
    background: "rgba(255, 255, 255, 0.98)",
    padding: "24px 30px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "420px",
    boxShadow: "0 20px 50px rgba(76, 29, 149, 0.3)",
  },
  cancelBtn: {
    padding: "10px 18px",
    background: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  ghostBtn: {
    padding: "10px 18px",
    background: "transparent",
    color: "#6d28d9",
    border: "1px solid #c4b5fd",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  primaryBtn: {
    padding: "10px 18px",
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};
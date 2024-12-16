document.addEventListener("DOMContentLoaded", () => {
  const addNoteBtn = document.getElementById("addNoteBtn");
  const appEl = document.getElementById("app");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const exportPngBtn = document.getElementById("exportPngBtn");
  const darkModeBtn = document.getElementById("darkModeBtn");
  const searchInput = document.getElementById("searchInput");

  // Load existing notes from local storage
  getNotes().forEach((note) => {
    const noteEl = createNote(note.id, note.content);
    appEl.appendChild(noteEl);
  });

  // Create a new note element
  function createNote(id, content = "") {
    const element = document.createElement("div");
    element.classList.add("note");

    const textarea = document.createElement("textarea");
    textarea.classList.add("note-text");
    textarea.placeholder = "Empty Note";
    textarea.value = content;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "×";

    deleteBtn.addEventListener("click", () => {
      const warning = confirm("Do you want to delete this note?");
      if (warning) {
        deleteNote(id, element);
      }
    });

    textarea.addEventListener("input", () => {
      updateNote(id, textarea.value);
    });

    element.appendChild(textarea);
    element.appendChild(deleteBtn);
    return element;
  }

  // Delete a note
  function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id);
    saveNotes(notes);
    appEl.removeChild(element);
  }

  // Update note content
  function updateNote(id, content) {
    const notes = getNotes();
    const target = notes.find((note) => note.id === id);
    if (target) {
      target.content = content;
      saveNotes(notes);
    }
  }

  // Add a new note
  function addNote() {
    const notes = getNotes();
    const note = {
      id: Math.floor(Math.random() * 100000),
      content: "",
    };
    const noteEl = createNote(note.id, note.content);
    appEl.appendChild(noteEl);
    notes.push(note);
    saveNotes(notes);
  }

  // Save notes to local storage
  function saveNotes(notes) {
    localStorage.setItem("note-app", JSON.stringify(notes));
  }

  // Get notes from local storage
  function getNotes() {
    return JSON.parse(localStorage.getItem("note-app") || "[]");
  }

  // Export to PDF
  function exportToPdf() {
    html2canvas(appEl, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("notes.pdf");
    }).catch((error) => {
      console.error("Error exporting to PDF: ", error);
    });
  }

  // Export to PNG
  function exportToPng() {
    html2canvas(appEl).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "notes.png";
      link.click();
    }).catch((error) => {
      console.error("Error exporting to PNG: ", error);
    });
  }

  // Toggle Dark Mode
  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }

  // Search notes
  function searchNotes() {
    const query = searchInput.value.toLowerCase();
    const notes = getNotes();
    appEl.innerHTML = ""; // Clear current notes
    const filteredNotes = notes.filter((note) =>
      note.content.toLowerCase().includes(query)
    );
    filteredNotes.forEach((note) => {
      const noteEl = createNote(note.id, note.content);
      appEl.appendChild(noteEl);
    });
  }

  // Event Listeners
  addNoteBtn.addEventListener("click", addNote);
  exportPdfBtn.addEventListener("click", exportToPdf);
  exportPngBtn.addEventListener("click", exportToPng);
  darkModeBtn.addEventListener("click", toggleDarkMode);
  searchInput.addEventListener("input", searchNotes);
});

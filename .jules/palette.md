## 2024-07-25 - UI Overlay Blocks Interaction
**Learning:** The application has a full-screen overlay with the ID `#focus` that appears on page load. This overlay blocks all pointer events to other UI elements until the main game area (`#game`) is clicked.
**Action:** For any future frontend verification or testing involving UI interaction, the first step must be to click the `#game` element to dismiss the `#focus` overlay before attempting to interact with other elements like buttons or inputs.

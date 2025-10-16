import app from "./app.js"; // ✅ must be at the top

console.log("=== server.js started ===");

const PORT = 3000;

try {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error("Error while starting server:", err);
}

console.log("=== server.js started ===");

try {
    const app = require("./app");
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
} catch (err) {
  console.error("Error while starting server:", err);  
}


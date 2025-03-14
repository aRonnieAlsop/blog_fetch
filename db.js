const sqlite3 = require('sqlite3').verbose();

//creates an in memory database:
const db = new sqlite3.Database(':memory:'); // in memory for simplicity

// create the posts table
db.serialize(() => {
    db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, author TEXT)");


    //some example posts inserted: 
    const stmt = db.prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
    stmt.run("First Post", "This is the content of the first post", "John Doe");
    stmt.run("Second Post", "This is the content of the second post", "Jane Smith");
    stmt.finalize();
});

module.exports = db; 
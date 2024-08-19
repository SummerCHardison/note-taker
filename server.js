const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const api = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(api);
    return api;
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated reviews!')
                );
            }
        })
        res.json(newNote);
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);
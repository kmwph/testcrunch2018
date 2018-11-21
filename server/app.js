import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set access control
app.use(cors());

var db = [];

// Get all todos
app.get('/api/v1/todos', (req, res) => {
    console.log('Get todos called.');

    res.status(200).send({
        success: 'true',
        message: 'todos retrieved successfully',
        data: db
    })
});

// Create new todo
app.post('/api/v1/todos', (req, res) => {
    console.log('Post todo called.');

    if (!req.body.name) {
        return res.status(400).send({
            success: 'false',
            message: 'name is required'
        });
    }

    const uniqueId = Math.random().toString(36).substr(2, 16);
    const todo = {
        id: uniqueId,
        name: req.body.name,
        finished: false
    }
    db.push(todo);
    return res.status(201).send({
        success: 'true',
        message: 'todo added successfully',
        data: todo
    })
});

// Delete todo
app.delete('/api/v1/todos/:id', (req, res) => {
    console.log('Delete todo called.');

    const id = req.params.id;
    const index = db.findIndex(todo => todo.id === id);

    if (index > -1) {
        db.splice(index, 1);
        return res.status(200).send({
            success: 'true',
            message: 'Todo deleted successfully',
        });
    };

    return res.status(404).send({
        success: 'false',
        message: 'todo not found',
    });
});

// Partial patch todo
app.patch('/api/v1/todos/:id', (req, res) => {
    console.log('Patch todo called.');

    const id = req.params.id;
    const index = db.findIndex(todo => todo.id === id);

    if (index < 0) {
        return res.status(404).send({
            success: 'false',
            message: 'todo not found',
        });
    }

    if (req.body.finished && typeof req.body.finished != "boolean") {
        return res.status(400).send({
            success: 'false',
            message: 'finished status should be boolean'
        });
    };

    const updatedTodo = Object.assign(db[index], req.body);

    return res.status(200).send({
        success: 'true',
        message: 'todo updated successfully',
        data: updatedTodo,
    });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});
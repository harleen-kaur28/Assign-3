/*********************************************************************************
* WEB700 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Harleen Kaur  Student ID: 154157234 Date: 14/06/2024
*
********************************************************************************/
//Required modules
const express = require('express');
const path = require('path');
const collegeData = require('./collegeData'); // Assuming collegeData.js is in the same directory

// Constants
const HTTP_PORT = process.env.PORT || 8080;
const app = express();

// Middleware to serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, 'views')));

// Function to initialize college data
function initialize() {
    return collegeData.initialize('./data/')
        .then(() => {
            console.log('Data initialized successfully.');
        })
        .catch((err) => {
            console.error('Failed to initialize data:', err);
            throw err; // Propagate the error further
        });
}

// Routes

// Route to get all students or students by course
app.get('/students', (req, res) => {
    let course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(parseInt(course))
            .then((students) => {
                if (students.length === 0) {
                    res.status(404).json({ message: 'no results' });
                } else {
                    res.json(students);
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    } else {
        collegeData.getAllStudents()
            .then((students) => {
                if (students.length === 0) {
                    res.status(404).json({ message: 'no results' });
                } else {
                    res.json(students);
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    }
});

// Route to get TAs
app.get('/tas', (req, res) => {
    collegeData.getTAs()
        .then((tas) => {
            if (tas.length === 0) {
                res.status(404).json({ message: 'no results' });
            } else {
                res.json(tas);
            }
        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});

// Route to get all courses
app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            if (courses.length === 0) {
                res.status(404).json({ message: 'no results' });
            } else {
                res.json(courses);
            }
        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});

// Route to get a single student by student number
app.get('/student/:num', (req, res) => {
    let studentNum = req.params.num;
    collegeData.getStudentByNum(parseInt(studentNum))
        .then((student) => {
            if (!student) {
                res.status(404).json({ message: 'no results' });
            } else {
                res.json(student);
            }
        })
        .catch((err) => {
            res.status(500).json({ message: err.message });
        });
});

// Route to serve home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Route to serve about.html
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to serve htmlDemo.html
app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

// 404 route handler
app.use((req, res) => {
    res.status(404).send('Page Not THERE, Are you sure of the path?');
});

// Start server after initializing data
initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server is running and listening on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
    });

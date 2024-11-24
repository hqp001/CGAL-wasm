const Module = require('./f.js'); // Adjust the path if needed

Module().then((instance) => {
    const inputArray = [
        { x: 0, y: 0 },
        { x: 0.9, y: 0 },
        { x: 0, y: 0.9 },
        { x: 0.9, y: 0.9 },
        { x: 0.5, y: 0.5 }
    ];

    // Call the processArray function
    const delaunayFaces = instance.processArray(inputArray);

    console.log('Delaunay Triangulation Faces:', delaunayFaces);
});


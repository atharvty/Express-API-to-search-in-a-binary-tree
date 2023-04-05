const express = require('express');
const app = express();
const mongodb = require('mongodb');

// Connect to the MongoDB database
mongodb.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    console.error(err);
    return;
  }

  // Get the binary_tree collection
  const db = client.db('mydb');
  const collection = db.collection('binary_tree');

  // Define the API endpoint
  app.get('/breadth-first-search/:id', (req, res) => {
    const startId = req.params.id;
    const queue = [startId];
    const result = [];

    while (queue.length > 0) {
      const nodeId = queue.shift();

      collection.findOne({ _id: nodeId }, (err, node) => {
        if (err) {
          console.error(err);
          return;
        }

        if (node) {
          result.push(node);

          if (node.left) {
            queue.push(node.left);
          }

          if (node.right) {
            queue.push(node.right);
          }
        }

        if (queue.length === 0) {
          res.json(result);
        }
      });
    }
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});

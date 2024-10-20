//import { MongoClient, ObjectId } from "mongodb";

// How to set up the driver and perform the simple CRUD operations.
//using a host of 127.0.0.1 in place of localhost

/* const connectionURL = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionURL);
const databaseName = "task-manager"; */

//async function main() {
// Use connect method to connect to the server
/* await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(databaseName); */

// Perform CRUD operations here.
// CREATE data
/* const result = await db
    .collection("tasks")
    .insertMany([
      {
        description: "Make the taxes",
        completed: false,
      },
      {
        description: "Water the flowers",
        completed: false,
      },
      {
        description: "Clean the kitchen",
        completed: true,
      },
    ])
    .catch(console.error); */

//console.log(`New document inserted with ID: ${result.insertedIds}`); // with 'findOne' then it would be 'insertedId' without the 's'

// READ data
/* const resultOne = await db
    .collection("tasks")
    .findOne({ _id: new ObjectId("67139cc496c0402b2f212c97") })
    .catch(console.error);

  console.log(resultOne);

  const resulTwo = await db
    .collection("tasks")
    .find({ completed: false })
    .toArray()
    .catch(console.error);

  console.log(resulTwo); */

// UPDATE data
/* const result = await db
    .collection("tasks")
    .updateMany({ completed: false }, { $set: { completed: true } }) //2 params. 1: filter, 2: the updates
    .catch(console.error);

  console.log(result); */

// DELETE data
/* const result = await db
    .collection("tasks")
    .deleteMany({ completed: true })
    .catch(console.error);

  console.log(result); */

//   return "Done!";
//}

/* main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close()); */

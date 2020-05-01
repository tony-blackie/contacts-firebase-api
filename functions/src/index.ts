import * as admin from "firebase-admin";
import * as firebaseHelper from "firebase-functions-helper";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as functions from "firebase-functions";
import * as cors from "cors";
import { map } from "lodash";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
const main = express();
const contactsCollection = "contacts";
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(cors({ origin: false }));
// const cors = require("cors")({ origin: true });
// webApi is your functions name, and you will pass main as
// a parameter
export const webApi = functions.https.onRequest(main);

// Add new contact
app.post("/contacts", async (req, res) => {
  try {
    const contact = {
      firstName: req.body["firstName"],
      lastName: req.body["lastName"],
      email: req.body["email"],
    };
    const newDoc = await firebaseHelper.firestore.createNewDocument(
      db,
      contactsCollection,
      contact
    );
    res
      .set("Access-Control-Allow-Origin", "*")
      .status(201)
      .send(`Created a new contact: ${newDoc.id}`);
  } catch (error) {
    res
      .set("Access-Control-Allow-Origin", "*")
      .status(400)
      .send(`Contact should only contains firstName, lastName and email!!!`);
  }
});
// Update new contact
app.patch("/contacts/:contactId", async (req, res) => {
  const updatedDoc = await firebaseHelper.firestore.updateDocument(
    db,
    contactsCollection,
    req.params.contactId,
    req.body
  );
  res
    .set("Access-Control-Allow-Origin", "*")
    .status(204)
    .send(`Update a new contact: ${updatedDoc}`);
});
// View a contact
app.get("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, contactsCollection, req.params.contactId)
    .then((doc) =>
      res.set("Access-Control-Allow-Origin", "*").status(200).send(doc)
    )
    .catch((error) =>
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(400)
        .send(`Cannot get contact: ${error}`)
    );
});
// View all contacts
app.get("/contacts", (req, res) => {
  firebaseHelper.firestore
    .queryData(db, contactsCollection, [])
    // firebaseHelper.firestore
    // .backup(db, contactsCollection)
    .then((data) =>
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(map(data, (item) => item))
    )
    .catch((error) =>
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(400)
        .send(`Cannot get contacts: ${error}`)
    );
});
// Delete a contact
app.delete("/contacts/:contactId", async (req, res) => {
  const deletedContact = await firebaseHelper.firestore.deleteDocument(
    db,
    contactsCollection,
    req.params.contactId
  );
  res
    .set("Access-Control-Allow-Origin", "*")
    .status(204)
    .send(`Contact is deleted: ${deletedContact}`);
});

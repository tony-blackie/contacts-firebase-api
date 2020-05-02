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
    res.set("Access-Control-Allow-Origin", "*").status(201).send(newDoc);
  } catch (error) {
    res
      .set("Access-Control-Allow-Origin", "*")
      .status(400)
      .send(`Contact should only contains firstName, lastName and email!!!`);
  }
});
// Update new contact
app.patch("/contacts/:contactId", async (req, res) => {
  firebaseHelper.firestore
    .updateDocument(db, contactsCollection, req.params.contactId, {
      // it was just req.body instead of this object. TODO: test
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    })
    .then((updatedDoc) => {
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(`${req.params.contactId} updated successfully`);
    });
});
// View a contact
app.get("/contacts/:contactId", (req, res) => {
  firebaseHelper.firestore
    .getDocument(db, contactsCollection, req.params.contactId)
    .then((doc) =>
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(200)
        .send({ ...doc, id: req.params.contactId })
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
        .send(map(data, (item, id) => ({ ...item, id })))
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
  firebaseHelper.firestore
    .deleteDocument(db, contactsCollection, req.params.contactId)
    .then(() => {
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(204)
        .send(`${req.params.contactId} deleted successfully`);
    })
    .catch((error) =>
      res
        .set("Access-Control-Allow-Origin", "*")
        .status(400)
        .send(`Couldn't delete ${req.params.contactId}: ${error}`)
    );
});

### 🚀 MongoDB Data Import

To import the `users` collection back into MongoDB, run this command:

```bash
mongoimport --db HRM --collection users --file db-data/users.json --jsonArray

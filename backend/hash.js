const bcrypt = require("bcrypt");

const plainTextPassword = "abc123"; 
const saltRounds = 10;

bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error(err);
  } else {
    console.log("Hashed password:", hash);
  }
});

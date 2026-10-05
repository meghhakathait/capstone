// bcrypt use to hash the password before storing it in the database. This is a common practice to enhance security by ensuring that even if the database is compromised, the actual passwords are not exposed.

import bcrypt from "bcrypt";

const plainPassword = "admin@123";
// Hash the plain password with a salt round of 10. The higher the number, the more secure but also slower the hashing process will be.
const hashed = await bcrypt.hash(plainPassword, 10);
console.log(hashed);

// Compare the plain password with the hashed password to verify if they match.The output will be true if the passwords match, and false otherwise.
const isMatch = await bcrypt.compare(plainPassword, hashed);
console.log(isMatch);
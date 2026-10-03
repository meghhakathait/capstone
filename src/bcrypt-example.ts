// bcrypt use to hash the password before storing it in the database. This is a common practice to enhance security by ensuring that even if the database is compromised, the actual passwords are not exposed.

import bcrypt from "bcrypt";

const plainPassword = "admin@123";

const hashed = await bcrypt.hash(plainPassword, 10);
console.log(hashed);

const isMatch = await bcrypt.compare(plainPassword, hashed);
console.log(isMatch);

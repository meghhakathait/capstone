// import jwt from "jsonwebtoken";
// export default function LoginPage() {
//   const token = jwt.sign(
//     { user: "megha", gender: "female", isActive: true },
//     "80VUS1SDqrU6ZD9xPzVnB2EHrHMvMXICdmR8E5BRk0G",
//     { expiresIn: "7d" }, //predefined
//   );
//   console.log(token);
//   // phle hota hai data dusera secret key generator and it is use for login
//   const decodeToken = jwt.verify(
//     token,
//     "80VUS1SDqrU6ZD9xPzVnB2EHrHMvMXICdmR8E5BRk0G",
//   );
//   console.log(decodeToken);
//   //decode will give the data we are sending.
//   return (
//     <div>
//       <h1>Login</h1>
//     </div>
//   );
// }


// A JSON Web Token (JWT) secret key is a secure, random string used by a server to sign and verify digital signatures on authentication tokens.

// • Signing: The issuer uses the secret key to create a unique cryptographic signature for the token's header and payload.
// • Verification: The receiver uses the same key to verify that the token is authentic and has not been changed.
// • Security: A strong, hidden key prevents attackers from forging valid user tokens.
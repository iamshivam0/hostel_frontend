const { JWT } = require("google-auth-library");
const fs = require("fs");
// Path to your service account key file
const SERVICE_ACCOUNT_FILE =
    "C:\\Users\\ayush\\Downloads\\servicegoogle.json";
// Load the service account key
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE));
// Define the required scopes
const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];
// Create a JWT client
const client = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: SCOPES
});

async function getAccessToken() {
    const tokens = await client.authorize();
    console.log(tokens.access_token);
    return tokens.access_token;
}

getAccessToken()
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keysDir = path.join(__dirname, "..", "keys");
const privateKeyPath = path.join(keysDir, "private.pem");
const publicKeyPath = path.join(keysDir, "public.pem");

let privateKey = null;
let publicKey = null;

// Initialize keys on startup
export const initKeys = () => {
  if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
    privateKey = fs.readFileSync(privateKeyPath, "utf8");
    publicKey = fs.readFileSync(publicKeyPath, "utf8");
    console.log("RSA keys loaded from filesystem.");
  } else {
    console.log("Generating new RSA keys...");
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir);
    }
    const { privateKey: privKey, publicKey: pubKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });
    privateKey = privKey;
    publicKey = pubKey;
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log("New RSA keys generated and saved.");
  }
};

export const encryptPayload = (payload) => {
  if (!publicKey) initKeys();
  const buffer = Buffer.from(JSON.stringify(payload), "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

export const decryptPayload = (encryptedData) => {
  if (!privateKey) initKeys();
  const buffer = Buffer.from(encryptedData, "base64");
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return JSON.parse(decrypted.toString("utf8"));
};

import { hmac } from "@oslojs/crypto/hmac";
import { SHA256 } from "@oslojs/crypto/sha2";
import { constantTimeEqual } from "@oslojs/crypto/subtle";
import {
  createJWTSignatureMessage,
  encodeJWT,
  joseAlgorithmHS256,
  JWSRegisteredHeaders,
  JWTRegisteredClaims,
  parseJWT,
} from "@oslojs/jwt";

interface Token {
  provider: "discord" | "github";
  userId: string;
  name: string;
  email: string;
}

const JWT_HEADER = {
  alg: joseAlgorithmHS256,
  typ: "JWT",
};

export function createJWT(token: Token, secret: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week

  const headerJSON = JSON.stringify(JWT_HEADER);
  const payloadJSON = JSON.stringify({
    sub: `${token.provider}:${token.userId}`,
    name: token.name,
    email: token.email,
    exp: Math.floor(expires.getTime() / 1000),
    nbf: Math.floor(Date.now() / 1000) - 60, // Allow for 1 minute clock skew
  });

  const signatureMessage = createJWTSignatureMessage(headerJSON, payloadJSON);
  const signature = hmac(
    SHA256,
    new TextEncoder().encode(secret),
    signatureMessage,
  );

  const jwt = encodeJWT(headerJSON, payloadJSON, signature);

  return { jwt, expires };
}

export function verifyJWT(jwt: string, secret: string) {
  const [header, payload, signature, signatureMessage] = parseJWT(jwt);
  const headerParameters = new JWSRegisteredHeaders(header);
  const claims = new JWTRegisteredClaims(payload);

  if (headerParameters.algorithm() !== joseAlgorithmHS256) {
    throw new Error("Unsupported algorithm");
  }

  const expectedSignature = hmac(
    SHA256,
    new TextEncoder().encode(secret),
    signatureMessage,
  );
  const valid = constantTimeEqual(signature, expectedSignature);
  if (!valid) {
    throw new Error("Invalid signature");
  }

  if (!claims.verifyExpiration()) {
    throw new Error("Expired token");
  }

  if (!claims.verifyNotBefore()) {
    throw new Error("Invalid token");
  }

  const sub = claims.subject();
  const [provider, userId] = sub.split(":");

  if (!("name" in payload && typeof payload.name === "string")) {
    throw new Error("Invalid token");
  }

  if (!("email" in payload && typeof payload.email === "string")) {
    throw new Error("Invalid token");
  }

  return {
    sub,
    provider,
    userId,
    name: payload.name,
    email: payload.email,
  };
}

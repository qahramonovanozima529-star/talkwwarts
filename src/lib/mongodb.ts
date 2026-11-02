import { MongoClient, Db } from "mongodb";

/**
 * Global MongoDB Client Singleton & Connection Caching
 * Ensures high performance and avoids connection leaks in serverless/Next.js environments.
 */

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) {
    return null;
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

/**
 * Returns the MongoDB Database instance safely.
 */
export async function getDatabase(dbName = "talkwarts"): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) {
    return null;
  }
  try {
    const connectedClient = await promise;
    return connectedClient.db(dbName);
  } catch (error) {
    console.warn("MongoDB connection could not be established:", error);
    return null;
  }
}

/**
 * NoSQL Injection Sanitization Utility
 * Recursively strips keys starting with '$' or containing '.' to prevent NoSQL query operator injections.
 */
export function sanitizeQuery<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    return data.trim() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeQuery(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Disallow MongoDB operators ($where, $gt, $ne, $regex, etc.) or dotted path tampering
      if (key.startsWith("$") || key.includes(".")) {
        continue;
      }
      sanitizedObj[key] = sanitizeQuery(value);
    }
    return sanitizedObj as T;
  }

  return data;
}

export default getClientPromise;

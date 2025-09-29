import type { AdminUserAccount } from "../../shared/types";

interface MongoAdminUserDocument {
    _id: string | { toString(): string }, // MongoDB ObjectId or string
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
    password: string,
    [key: string]: any // Additional fields that might exist
}

/**
 * Factory function to convert MongoDB document to AdminUserAccount
 * @param mongoDoc - The document returned from MongoDB
 * @returns AdminUserAccount object with proper id field
 */
export function createAdminUserAccount(mongoDoc: MongoAdminUserDocument): AdminUserAccount {
    console.log(mongoDoc)
    return {
        id: typeof mongoDoc._id === 'string' ? mongoDoc._id : mongoDoc._id.toString(),
        firstName: mongoDoc.firstName,
        lastName: mongoDoc.lastName,
        email: mongoDoc.email,
        phone: mongoDoc.phone,
        password: mongoDoc.password
    };
}

/**
 * Factory function to convert array of MongoDB documents to AdminUserAccount array
 * @param mongoDocs - Array of documents returned from MongoDB
 * @returns Array of AdminUserAccount objects
 */
export function createAdminUserAccounts(mongoDocs: MongoAdminUserDocument[]): AdminUserAccount[] {
    return mongoDocs.map(createAdminUserAccount);
}
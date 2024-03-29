/// <reference lib="esnext.asynciterable" />
import * as coreHttp from '@azure/core-http';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { PageSettings } from '@azure/core-paging';
import { PipelineOptions } from '@azure/core-http';
import { PollerLike } from '@azure/core-lro';
import { PollOperationState } from '@azure/core-lro';
import { TokenCredential } from '@azure/core-http';

/**
 * Decryption parameters for AES-CBC encryption algorithms.
 */
export declare interface AesCbcDecryptParameters {
    /**
     * The encryption algorithm to use.
     */
    algorithm: AesCbcEncryptionAlgorithm;
    /**
     * The initialization vector used during encryption.
     */
    /**
     * The ciphertext to decrypt.
     */
    ciphertext: Uint8Array;
    /**
     * The initialization vector generated during encryption.
     */
    iv: Uint8Array;
}

/**
 * A union type representing all supported AES-CBC encryption algorithms.
 */
export declare type AesCbcEncryptionAlgorithm = "A128CBC" | "A192CBC" | "A256CBC" | "A128CBCPAD" | "A192CBCPAD" | "A256CBCPAD";

/**
 * Encryption parameters for AES-CBC encryption algorithms.
 */
export declare interface AesCbcEncryptParameters {
    /**
     * The encryption algorithm to use.
     */
    algorithm: AesCbcEncryptionAlgorithm;
    /**
     * The plain text to encrypt.
     */
    plaintext: Uint8Array;
    /**
     * The initialization vector used for encryption. If omitted we will attempt to generate an IV using crypto's `randomBytes` functionality.
     * An error will be thrown if creating an IV fails, and you may recover by passing in your own cryptographically secure IV.
     */
    iv?: Uint8Array;
}

/**
 * Decryption parameters for AES-GCM encryption algorithms.
 */
export declare interface AesGcmDecryptParameters {
    /**
     * The encryption algorithm to use.
     */
    algorithm: AesGcmEncryptionAlgorithm;
    /**
     * The ciphertext to decrypt.
     */
    ciphertext: Uint8Array;
    /**
     * The initialization vector (or nonce) generated during encryption.
     */
    iv: Uint8Array;
    /**
     * The authentication tag generated during encryption.
     */
    authenticationTag: Uint8Array;
    /**
     * Optional data that is authenticated but not encrypted.
     */
    additionalAuthenticatedData?: Uint8Array;
}

/**
 * A union type representing all supported AES-GCM encryption algorithms.
 */
export declare type AesGcmEncryptionAlgorithm = "A128GCM" | "A192GCM" | "A256GCM";

/**
 * Encryption parameters for AES-GCM encryption algorithms.
 */
export declare interface AesGcmEncryptParameters {
    /**
     * The encryption algorithm to use.
     */
    algorithm: AesGcmEncryptionAlgorithm;
    /**
     * The plain text to encrypt.
     */
    plaintext: Uint8Array;
    /**
     * Optional data that is authenticated but not encrypted.
     */
    additionalAuthenticatedData?: Uint8Array;
}

/**
 * Options for {@link backupKey}.
 */
export declare interface BackupKeyOptions extends coreHttp.OperationOptions {
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link beginDeleteKey}
 */
export declare interface BeginDeleteKeyOptions extends KeyPollerOptions {
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link beginRecoverDeletedKey}
 */
export declare interface BeginRecoverDeletedKeyOptions extends KeyPollerOptions {
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link createEcKey}
 */
export declare interface CreateEcKeyOptions extends CreateKeyOptions {
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link createKey}
 */
export declare interface CreateKeyOptions extends coreHttp.OperationOptions {
    /**
     * Application specific metadata in the form of key-value pairs.
     */
    tags?: {
        [propertyName: string]: string;
    };
    /**
     * Json web key operations. For more
     * information on possible key operations, see KeyOperation.
     */
    keyOps?: KeyOperation[];
    /**
     * Determines whether the object is enabled.
     */
    enabled?: boolean;
    /**
     * Not before date in UTC.
     */
    notBefore?: Date;
    /**
     * Expiry date in UTC.
     */
    readonly expiresOn?: Date;
    /**
     * The key size in bits. For example: 2048, 3072, or 4096 for RSA.
     */
    keySize?: number;
    /**
     * Elliptic curve name. For valid values, see KeyCurveName.
     * Possible values include: 'P-256', 'P-384', 'P-521', 'P-256K'
     */
    curve?: KeyCurveName;
    /**
     * Whether to import as a hardware key (HSM) or software key.
     */
    hsm?: boolean;
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link createOctKey}
 */
export declare interface CreateOctKeyOptions extends CreateKeyOptions {
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link createRsaKey}
 */
export declare interface CreateRsaKeyOptions extends CreateKeyOptions {
    /** The public exponent for a RSA key. */
    publicExponent?: number;
}

/**
 * A client used to perform cryptographic operations on an Azure Key vault key
 * or a local {@link JsonWebKey}.
 */
export declare class CryptographyClient {
    /**
     * The key the CryptographyClient currently holds.
     */
    private key;
    /**
     * The remote provider, which would be undefined if used in local mode.
     */
    private remoteProvider?;
    /**
     * Constructs a new instance of the Cryptography client for the given key
     *
     * Example usage:
     * ```ts
     * import { KeyClient, CryptographyClient } from "@azure/keyvault-keys";
     * import { DefaultAzureCredential } from "@azure/identity";
     *
     * let vaultUrl = `https://<MY KEYVAULT HERE>.vault.azure.net`;
     * let credentials = new DefaultAzureCredential();
     *
     * let keyClient = new KeyClient(vaultUrl, credentials);
     * let keyVaultKey = await keyClient.getKey("MyKey");
     *
     * let client = new CryptographyClient(keyVaultKey.id, credentials);
     * // or
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * ```
     * @param key - The key to use during cryptography tasks. You can also pass the identifier of the key i.e its url here.
     * @param credential - An object that implements the `TokenCredential` interface used to authenticate requests to the service. Use the \@azure/identity package to create a credential that suits your needs.
     * @param pipelineOptions - Pipeline options used to configure Key Vault API requests.
     *                          Omit this parameter to use the default pipeline configuration.
     */
    constructor(key: string | KeyVaultKey, credential: TokenCredential, pipelineOptions?: CryptographyClientOptions);
    /**
     * Constructs a new instance of the Cryptography client for the given key in local mode.
     *
     * Example usage:
     * ```ts
     * import { CryptographyClient } from "@azure/keyvault-keys";
     *
     * const jsonWebKey: JsonWebKey = {
     *   // ...
     * };
     * const client = new CryptographyClient(jsonWebKey);
     * ```
     * @param key - The JsonWebKey to use during cryptography operations.
     */
    constructor(key: JsonWebKey);
    /**
     * The base URL to the vault. If a local {@link JsonWebKey} is used vaultUrl will be empty.
     */
    get vaultUrl(): string;
    /**
     * The ID of the key used to perform cryptographic operations for the client.
     */
    get keyID(): string | undefined;
    /**
     * Encrypts the given plaintext with the specified encryption parameters.
     * Depending on the algorithm set in the encryption parameters, the set of possible encryption parameters will change.
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.encrypt({ algorithm: "RSA1_5", plaintext: Buffer.from("My Message")});
     * let result = await client.encrypt({ algorithm: "A256GCM", plaintext: Buffer.from("My Message"), additionalAuthenticatedData: Buffer.from("My authenticated data")});
     * ```
     * @param encryptParameters - The encryption parameters, keyed on the encryption algorithm chosen.
     * @param options - Additional options.
     */
    encrypt(encryptParameters: EncryptParameters, options?: EncryptOptions): Promise<EncryptResult>;
    /**
     * Encrypts the given plaintext with the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.encrypt("RSA1_5", Buffer.from("My Message"));
     * ```
     * @param algorithm - The algorithm to use.
     * @param plaintext - The text to encrypt.
     * @param options - Additional options.
     * @deprecated Use `encrypt({ algorithm, plaintext }, options)` instead.
     */
    encrypt(algorithm: EncryptionAlgorithm, plaintext: Uint8Array, options?: EncryptOptions): Promise<EncryptResult>;
    private initializeIV;
    /**
     * Standardizes the arguments of multiple overloads into a single shape.
     * @param args - The encrypt arguments
     */
    private disambiguateEncryptArguments;
    /**
     * Decrypts the given ciphertext with the specified decryption parameters.
     * Depending on the algorithm used in the decryption parameters, the set of possible decryption parameters will change.
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.decrypt({ algorithm: "RSA1_5", ciphertext: encryptedBuffer });
     * let result = await client.decrypt({ algorithm: "A256GCM", iv: ivFromEncryptResult, authenticationTag: tagFromEncryptResult });
     * ```
     * @param decryptParameters - The decryption parameters.
     * @param options - Additional options.
     */
    decrypt(decryptParameters: DecryptParameters, options?: DecryptOptions): Promise<DecryptResult>;
    /**
     * Decrypts the given ciphertext with the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.decrypt("RSA1_5", encryptedBuffer);
     * ```
     * @param algorithm - The algorithm to use.
     * @param ciphertext - The text to decrypt.
     * @param options - Additional options.
     * @deprecated Use `decrypt({ algorithm, ciphertext }, options)` instead.
     */
    decrypt(algorithm: EncryptionAlgorithm, ciphertext: Uint8Array, options?: DecryptOptions): Promise<DecryptResult>;
    /**
     * Standardizes the arguments of multiple overloads into a single shape.
     * @param args - The decrypt arguments
     */
    private disambiguateDecryptArguments;
    /**
     * Wraps the given key using the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.wrapKey("RSA1_5", keyToWrap);
     * ```
     * @param algorithm - The encryption algorithm to use to wrap the given key.
     * @param key - The key to wrap.
     * @param options - Additional options.
     */
    wrapKey(algorithm: KeyWrapAlgorithm, key: Uint8Array, options?: WrapKeyOptions): Promise<WrapResult>;
    /**
     * Unwraps the given wrapped key using the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.unwrapKey("RSA1_5", keyToUnwrap);
     * ```
     * @param algorithm - The decryption algorithm to use to unwrap the key.
     * @param encryptedKey - The encrypted key to unwrap.
     * @param options - Additional options.
     */
    unwrapKey(algorithm: KeyWrapAlgorithm, encryptedKey: Uint8Array, options?: UnwrapKeyOptions): Promise<UnwrapResult>;
    /**
     * Cryptographically sign the digest of a message
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.sign("RS256", digest);
     * ```
     * @param algorithm - The signing algorithm to use.
     * @param digest - The digest of the data to sign.
     * @param options - Additional options.
     */
    sign(algorithm: SignatureAlgorithm, digest: Uint8Array, options?: SignOptions): Promise<SignResult>;
    /**
     * Verify the signed message digest
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.verify("RS256", signedDigest, signature);
     * ```
     * @param algorithm - The signing algorithm to use to verify with.
     * @param digest - The digest to verify.
     * @param signature - The signature to verify the digest against.
     * @param options - Additional options.
     */
    verify(algorithm: SignatureAlgorithm, digest: Uint8Array, signature: Uint8Array, options?: VerifyOptions): Promise<VerifyResult>;
    /**
     * Cryptographically sign a block of data
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.signData("RS256", message);
     * ```
     * @param algorithm - The signing algorithm to use.
     * @param data - The data to sign.
     * @param options - Additional options.
     */
    signData(algorithm: SignatureAlgorithm, data: Uint8Array, options?: SignOptions): Promise<SignResult>;
    /**
     * Verify the signed block of data
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.verifyData("RS256", signedMessage, signature);
     * ```
     * @param algorithm - The algorithm to use to verify with.
     * @param data - The signed block of data to verify.
     * @param signature - The signature to verify the block against.
     * @param options - Additional options.
     */
    verifyData(algorithm: SignatureAlgorithm, data: Uint8Array, signature: Uint8Array, options?: VerifyOptions): Promise<VerifyResult>;
    /* Excluded from this release type: getKeyMaterial */
    /**
     * Returns the underlying key used for cryptographic operations.
     * If needed, fetches the key from KeyVault and exchanges the ID for the actual key.
     * @param options - The additional options.
     */
    private fetchKey;
    private providers?;
    /**
     * Gets the provider that support this algorithm and operation.
     * The available providers are ordered by priority such that the first provider that supports this
     * operation is the one we should use.
     * @param operation - The {@link KeyOperation}.
     * @param algorithm - The algorithm to use.
     */
    private getProvider;
    private ensureValid;
}

/**
 * The optional parameters accepted by the KeyVault's CryptographyClient
 */
export declare interface CryptographyClientOptions extends KeyClientOptions {
}

/**
 * An interface representing the options of the cryptography API methods, go to the {@link CryptographyClient} for more information.
 */
export declare interface CryptographyOptions extends coreHttp.OperationOptions {
}

/**
 * Options for {@link decrypt}.
 */
export declare interface DecryptOptions extends CryptographyOptions {
}

/**
 * A type representing all currently supported decryption parameters as they apply to different encryption algorithms.
 */
export declare type DecryptParameters = RsaDecryptParameters | AesGcmDecryptParameters | AesCbcDecryptParameters;

/**
 * Result of the {@link decrypt} operation.
 */
export declare interface DecryptResult {
    /**
     * Result of the {@link decrypt} operation in bytes.
     */
    result: Uint8Array;
    /**
     * The ID of the Key Vault Key used to decrypt the encrypted data.
     */
    keyID?: string;
    /**
     * The {@link EncryptionAlgorithm} used to decrypt the encrypted data.
     */
    algorithm: EncryptionAlgorithm;
}

/**
 * An interface representing a deleted Key Vault Key.
 */
export declare interface DeletedKey {
    /**
     * The key value.
     */
    key?: JsonWebKey;
    /**
     * The name of the key.
     */
    name: string;
    /**
     * Key identifier.
     */
    id?: string;
    /**
     * JsonWebKey Key Type (kty), as defined in
     * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40. Possible values include:
     * 'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct', "oct-HSM"
     */
    keyType?: KeyType;
    /**
     * Operations allowed on this key
     */
    keyOperations?: KeyOperation[];
    /**
     * The properties of the key.
     */
    properties: KeyProperties & {
        /**
         * The url of the recovery object, used to
         * identify and recover the deleted key.
         */
        readonly recoveryId?: string;
        /**
         * The time when the key is scheduled to be purged, in UTC
         * **NOTE: This property will not be serialized. It can only be populated by
         * the server.**
         */
        readonly scheduledPurgeDate?: Date;
        /**
         * The time when the key was deleted, in UTC
         * **NOTE: This property will not be serialized. It can only be populated by
         * the server.**
         */
        deletedOn?: Date;
    };
}

/**
 * Defines values for DeletionRecoveryLevel. \
 * {@link KnownDeletionRecoveryLevel} can be used interchangeably with DeletionRecoveryLevel,
 *  this enum contains the known values that the service supports.
 * ### Know values supported by the service
 * **Purgeable**: Denotes a vault state in which deletion is an irreversible operation, without the possibility for recovery. This level corresponds to no protection being available against a Delete operation; the data is irretrievably lost upon accepting a Delete operation at the entity level or higher (vault, resource group, subscription etc.) \
 * **Recoverable+Purgeable**: Denotes a vault state in which deletion is recoverable, and which also permits immediate and permanent deletion (i.e. purge). This level guarantees the recoverability of the deleted entity during the retention interval (90 days), unless a Purge operation is requested, or the subscription is cancelled. System wil permanently delete it after 90 days, if not recovered \
 * **Recoverable**: Denotes a vault state in which deletion is recoverable without the possibility for immediate and permanent deletion (i.e. purge). This level guarantees the recoverability of the deleted entity during the retention interval(90 days) and while the subscription is still available. System wil permanently delete it after 90 days, if not recovered \
 * **Recoverable+ProtectedSubscription**: Denotes a vault and subscription state in which deletion is recoverable within retention interval (90 days), immediate and permanent deletion (i.e. purge) is not permitted, and in which the subscription itself  cannot be permanently canceled. System wil permanently delete it after 90 days, if not recovered \
 * **CustomizedRecoverable+Purgeable**: Denotes a vault state in which deletion is recoverable, and which also permits immediate and permanent deletion (i.e. purge when 7<= SoftDeleteRetentionInDays < 90). This level guarantees the recoverability of the deleted entity during the retention interval, unless a Purge operation is requested, or the subscription is cancelled. \
 * **CustomizedRecoverable**: Denotes a vault state in which deletion is recoverable without the possibility for immediate and permanent deletion (i.e. purge when 7<= SoftDeleteRetentionInDays < 90).This level guarantees the recoverability of the deleted entity during the retention interval and while the subscription is still available. \
 * **CustomizedRecoverable+ProtectedSubscription**: Denotes a vault and subscription state in which deletion is recoverable, immediate and permanent deletion (i.e. purge) is not permitted, and in which the subscription itself cannot be permanently canceled when 7<= SoftDeleteRetentionInDays < 90. This level guarantees the recoverability of the deleted entity during the retention interval, and also reflects the fact that the subscription itself cannot be cancelled.
 */
export declare type DeletionRecoveryLevel = string;

/**
 * Defines values for JsonWebKeyEncryptionAlgorithm. \
 * {@link KnownJsonWebKeyEncryptionAlgorithm} can be used interchangeably with JsonWebKeyEncryptionAlgorithm,
 *  this enum contains the known values that the service supports.
 * ### Know values supported by the service
 * **RSA-OAEP** \
 * **RSA-OAEP-256** \
 * **RSA1_5** \
 * **A128GCM** \
 * **A192GCM** \
 * **A256GCM** \
 * **A128KW** \
 * **A192KW** \
 * **A256KW** \
 * **A128CBC** \
 * **A192CBC** \
 * **A256CBC** \
 * **A128CBCPAD** \
 * **A192CBCPAD** \
 * **A256CBCPAD**
 */
export declare type EncryptionAlgorithm = string;

/**
 * Options for {@link encrypt}.
 */
export declare interface EncryptOptions extends CryptographyOptions {
}

/**
 * A type representing all currently supported encryption parameters as they apply to different encryption algorithms.
 */
export declare type EncryptParameters = RsaEncryptParameters | AesGcmEncryptParameters | AesCbcEncryptParameters;

/**
 * Result of the {@link encrypt} operation.
 */
export declare interface EncryptResult {
    /**
     * Result of the {@link encrypt} operation in bytes.
     */
    result: Uint8Array;
    /**
     * The {@link EncryptionAlgorithm} used to encrypt the data.
     */
    algorithm: EncryptionAlgorithm;
    /**
     * The ID of the Key Vault Key used to encrypt the data.
     */
    keyID?: string;
    /**
     * The initialization vector used for encryption.
     */
    iv?: Uint8Array;
    /**
     * The authentication tag resulting from encryption with a symmetric key including A128GCM, A192GCM, and A256GCM.
     */
    authenticationTag?: Uint8Array;
    /**
     * Additional data that is authenticated during decryption but not encrypted.
     */
    additionalAuthenticatedData?: Uint8Array;
}

/**
 * Options for {@link getDeletedKey}.
 */
export declare interface GetDeletedKeyOptions extends coreHttp.OperationOptions {
}

/**
 * Options for {@link getKey}.
 */
export declare interface GetKeyOptions extends coreHttp.OperationOptions {
    /**
     * The version of the secret to retrieve. If not
     * specified the latest version of the secret will be retrieved.
     */
    version?: string;
}

/**
 * An interface representing the optional parameters that can be
 * passed to {@link importKey}
 */
export declare interface ImportKeyOptions extends coreHttp.OperationOptions {
    /**
     * Application specific metadata in the form of key-value pairs.
     */
    tags?: {
        [propertyName: string]: string;
    };
    /**
     * Whether to import as a hardware key (HSM) or software key.
     */
    hardwareProtected?: boolean;
    /**
     * Determines whether the object is enabled.
     */
    enabled?: boolean;
    /**
     * Not before date in UTC.
     */
    notBefore?: Date;
    /**
     * Expiry date in UTC.
     */
    expiresOn?: Date;
}

/**
 * As of http://tools.ietf.org/html/draft-ietf-jose-json-web-key-18
 */
export declare interface JsonWebKey {
    /**
     * Key identifier.
     */
    kid?: string;
    /**
     * JsonWebKey Key Type (kty), as defined in
     * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40. Possible values include:
     * 'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct', "oct-HSM"
     */
    kty?: KeyType;
    /**
     * Json web key operations. For more
     * information on possible key operations, see KeyOperation.
     */
    keyOps?: KeyOperation[];
    /**
     * RSA modulus.
     */
    n?: Uint8Array;
    /**
     * RSA public exponent.
     */
    e?: Uint8Array;
    /**
     * RSA private exponent, or the D component of an EC private key.
     */
    d?: Uint8Array;
    /**
     * RSA private key parameter.
     */
    dp?: Uint8Array;
    /**
     * RSA private key parameter.
     */
    dq?: Uint8Array;
    /**
     * RSA private key parameter.
     */
    qi?: Uint8Array;
    /**
     * RSA secret prime.
     */
    p?: Uint8Array;
    /**
     * RSA secret prime, with `p < q`.
     */
    q?: Uint8Array;
    /**
     * Symmetric key.
     */
    k?: Uint8Array;
    /**
     * HSM Token, used with 'Bring Your Own Key'.
     */
    t?: Uint8Array;
    /**
     * Elliptic curve name. For valid values, see KeyCurveName. Possible values include:
     * 'P-256', 'P-384', 'P-521', 'P-256K'
     */
    crv?: KeyCurveName;
    /**
     * X component of an EC public key.
     */
    x?: Uint8Array;
    /**
     * Y component of an EC public key.
     */
    y?: Uint8Array;
}

/**
 * The KeyClient provides methods to manage {@link KeyVaultKey} in the
 * Azure Key Vault. The client supports creating, retrieving, updating,
 * deleting, purging, backing up, restoring and listing KeyVaultKeys. The
 * client also supports listing {@link DeletedKey} for a soft-delete enabled Azure Key
 * Vault.
 */
export declare class KeyClient {
    /**
     * The base URL to the vault
     */
    readonly vaultUrl: string;
    /* Excluded from this release type: client */
    /**
     * Creates an instance of KeyClient.
     *
     * Example usage:
     * ```ts
     * import { KeyClient } from "@azure/keyvault-keys";
     * import { DefaultAzureCredential } from "@azure/identity";
     *
     * let vaultUrl = `https://<MY KEYVAULT HERE>.vault.azure.net`;
     * let credentials = new DefaultAzureCredential();
     *
     * let client = new KeyClient(vaultUrl, credentials);
     * ```
     * @param vaultUrl - the URL of the Key Vault. It should have this shape: `https://${your-key-vault-name}.vault.azure.net`
     * @param credential - An object that implements the `TokenCredential` interface used to authenticate requests to the service. Use the \@azure/identity package to create a credential that suits your needs.
     * @param pipelineOptions - Pipeline options used to configure Key Vault API requests. Omit this parameter to use the default pipeline configuration.
     */
    constructor(vaultUrl: string, credential: TokenCredential, pipelineOptions?: KeyClientOptions);
    /**
     * The create key operation can be used to create any key type in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // Create an elliptic-curve key:
     * let result = await client.createKey("MyKey", "EC");
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param keyType - The type of the key. One of the following: 'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct'.
     * @param options - The optional parameters.
     */
    createKey(name: string, keyType: KeyType, options?: CreateKeyOptions): Promise<KeyVaultKey>;
    /**
     * The createEcKey method creates a new elliptic curve key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createEcKey("MyKey", { curve: "P-256" });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    createEcKey(name: string, options?: CreateEcKeyOptions): Promise<KeyVaultKey>;
    /**
     * The createRSAKey method creates a new RSA key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createRsaKey("MyKey", { keySize: 2048 });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    createRsaKey(name: string, options?: CreateRsaKeyOptions): Promise<KeyVaultKey>;
    /**
     * The createOctKey method creates a new OCT key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createOctKey("MyKey", { hsm: true });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    createOctKey(name: string, options?: CreateOctKeyOptions): Promise<KeyVaultKey>;
    /**
     * The import key operation may be used to import any key type into an Azure Key Vault. If the
     * named key already exists, Azure Key Vault creates a new version of the key. This operation
     * requires the keys/import permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // Key contents in myKeyContents
     * let result = await client.importKey("MyKey", myKeyContents);
     * ```
     * Imports an externally created key, stores it, and returns key parameters and properties
     * to the client.
     * @param name - Name for the imported key.
     * @param key - The JSON web key.
     * @param options - The optional parameters.
     */
    importKey(name: string, key: JsonWebKey, options?: ImportKeyOptions): Promise<KeyVaultKey>;
    /**
     * The delete operation applies to any key stored in Azure Key Vault. Individual versions
     * of a key can not be deleted, only all versions of a given key at once.
     *
     * This function returns a Long Running Operation poller that allows you to wait indefinitely until the key is deleted.
     *
     * This operation requires the keys/delete permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * await client.createKey("MyKey", "EC");
     * const poller = await client.beginDeleteKey("MyKey");
     *
     * // Serializing the poller
     * const serialized = poller.toString();
     * // A new poller can be created with:
     * // await client.beginDeleteKey("MyKey", { resumeFrom: serialized });
     *
     * // Waiting until it's done
     * const deletedKey = await poller.pollUntilDone();
     * console.log(deletedKey);
     * ```
     * Deletes a key from a specified key vault.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    beginDeleteKey(name: string, options?: BeginDeleteKeyOptions): Promise<PollerLike<PollOperationState<DeletedKey>, DeletedKey>>;
    /**
     * The updateKeyProperties method changes specified properties of an existing stored key. Properties that
     * are not specified in the request are left unchanged. The value of a key itself cannot be
     * changed. This operation requires the keys/set permission.
     *
     * Example usage:
     * ```ts
     * let keyName = "MyKey";
     * let client = new KeyClient(url, credentials);
     * let key = await client.getKey(keyName);
     * let result = await client.updateKeyProperties(keyName, key.properties.version, { enabled: false });
     * ```
     * Updates the properties associated with a specified key in a given key vault.
     * @param name - The name of the key.
     * @param keyVersion - The version of the key.
     * @param options - The optional parameters.
     */
    updateKeyProperties(name: string, keyVersion: string, options?: UpdateKeyPropertiesOptions): Promise<KeyVaultKey>;
    /**
     * The getKey method gets a specified key and is applicable to any key stored in Azure Key Vault.
     * This operation requires the keys/get permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let key = await client.getKey("MyKey");
     * ```
     * Get a specified key from a given key vault.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    getKey(name: string, options?: GetKeyOptions): Promise<KeyVaultKey>;
    /**
     * The getDeletedKey method returns the specified deleted key along with its properties.
     * This operation requires the keys/get permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let key = await client.getDeletedKey("MyDeletedKey");
     * ```
     * Gets the specified deleted key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    getDeletedKey(name: string, options?: GetDeletedKeyOptions): Promise<DeletedKey>;
    /**
     * The purge deleted key operation removes the key permanently, without the possibility of
     * recovery. This operation can only be enabled on a soft-delete enabled vault. This operation
     * requires the keys/purge permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * const deletePoller = await client.beginDeleteKey("MyKey")
     * await deletePoller.pollUntilDone();
     * await client.purgeDeletedKey("MyKey");
     * ```
     * Permanently deletes the specified key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    purgeDeletedKey(name: string, options?: PurgeDeletedKeyOptions): Promise<void>;
    /**
     * Recovers the deleted key in the specified vault. This operation can only be performed on a
     * soft-delete enabled vault.
     *
     * This function returns a Long Running Operation poller that allows you to wait indefinitely until the deleted key is recovered.
     *
     * This operation requires the keys/recover permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * await client.createKey("MyKey", "EC");
     * const deletePoller = await client.beginDeleteKey("MyKey");
     * await deletePoller.pollUntilDone();
     * const poller = await client.beginRecoverDeletedKey("MyKey");
     *
     * // Serializing the poller
     * const serialized = poller.toString();
     * // A new poller can be created with:
     * // await client.beginRecoverDeletedKey("MyKey", { resumeFrom: serialized });
     *
     * // Waiting until it's done
     * const key = await poller.pollUntilDone();
     * console.log(key);
     * ```
     * Recovers the deleted key to the latest version.
     * @param name - The name of the deleted key.
     * @param options - The optional parameters.
     */
    beginRecoverDeletedKey(name: string, options?: BeginRecoverDeletedKeyOptions): Promise<PollerLike<PollOperationState<DeletedKey>, DeletedKey>>;
    /**
     * Requests that a backup of the specified key be downloaded to the client. All versions of the
     * key will be downloaded. This operation requires the keys/backup permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let backupContents = await client.backupKey("MyKey");
     * ```
     * Backs up the specified key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    backupKey(name: string, options?: BackupKeyOptions): Promise<Uint8Array | undefined>;
    /**
     * Restores a backed up key, and all its versions, to a vault. This operation requires the
     * keys/restore permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let backupContents = await client.backupKey("MyKey");
     * // ...
     * let key = await client.restoreKeyBackup(backupContents);
     * ```
     * Restores a backed up key to a vault.
     * @param backup - The backup blob associated with a key bundle.
     * @param options - The optional parameters.
     */
    restoreKeyBackup(backup: Uint8Array, options?: RestoreKeyBackupOptions): Promise<KeyVaultKey>;
    /* Excluded from this release type: listPropertiesOfKeyVersionsPage */
    /* Excluded from this release type: listPropertiesOfKeyVersionsAll */
    /**
     * Iterates all versions of the given key in the vault. The full key identifier, properties, and tags are provided
     * in the response. This operation requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const keyProperties of client.listPropertiesOfKeyVersions("MyKey")) {
     *   const key = await client.getKey(keyProperties.name);
     *   console.log("key version: ", key);
     * }
     * ```
     * @param name - Name of the key to fetch versions for
     * @param options - The optional parameters.
     */
    listPropertiesOfKeyVersions(name: string, options?: ListPropertiesOfKeyVersionsOptions): PagedAsyncIterableIterator<KeyProperties>;
    /* Excluded from this release type: listPropertiesOfKeysPage */
    /* Excluded from this release type: listPropertiesOfKeysAll */
    /**
     * Iterates the latest version of all keys in the vault.  The full key identifier and properties are provided
     * in the response. No values are returned for the keys. This operations requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const keyProperties of client.listPropertiesOfKeys()) {
     *   const key = await client.getKey(keyProperties.name);
     *   console.log("key: ", key);
     * }
     * ```
     * List all keys in the vault
     * @param options - The optional parameters.
     */
    listPropertiesOfKeys(options?: ListPropertiesOfKeysOptions): PagedAsyncIterableIterator<KeyProperties>;
    /* Excluded from this release type: listDeletedKeysPage */
    /* Excluded from this release type: listDeletedKeysAll */
    /**
     * Iterates the deleted keys in the vault.  The full key identifier and properties are provided
     * in the response. No values are returned for the keys. This operations requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const deletedKey of client.listDeletedKeys()) {
     *   console.log("deleted key: ", deletedKey);
     * }
     * ```
     * List all keys in the vault
     * @param options - The optional parameters.
     */
    listDeletedKeys(options?: ListDeletedKeysOptions): PagedAsyncIterableIterator<DeletedKey>;
}

/**
 * The optional parameters accepted by the KeyVault's KeyClient
 */
export declare interface KeyClientOptions extends coreHttp.PipelineOptions {
    /**
     * The version of the KeyVault's service API to make calls against.
     */
    serviceVersion?: string;
}

/**
 * Defines values for JsonWebKeyCurveName. \
 * {@link KnownJsonWebKeyCurveName} can be used interchangeably with JsonWebKeyCurveName,
 *  this enum contains the known values that the service supports.
 * ### Know values supported by the service
 * **P-256**: The NIST P-256 elliptic curve, AKA SECG curve SECP256R1. \
 * **P-384**: The NIST P-384 elliptic curve, AKA SECG curve SECP384R1. \
 * **P-521**: The NIST P-521 elliptic curve, AKA SECG curve SECP521R1. \
 * **P-256K**: The SECG SECP256K1 elliptic curve.
 */
export declare type KeyCurveName = string;

/**
 * Defines values for JsonWebKeyOperation. \
 * {@link KnownJsonWebKeyOperation} can be used interchangeably with JsonWebKeyOperation,
 *  this enum contains the known values that the service supports.
 * ### Know values supported by the service
 * **encrypt** \
 * **decrypt** \
 * **sign** \
 * **verify** \
 * **wrapKey** \
 * **unwrapKey** \
 * **import**
 */
export declare type KeyOperation = string;

/**
 * An interface representing the optional parameters that can be
 * passed to {@link beginDeleteKey} and {@link beginRecoverDeletedKey}
 */
export declare interface KeyPollerOptions extends coreHttp.OperationOptions {
    /**
     * Time between each polling
     */
    intervalInMs?: number;
    /**
     * A serialized poller, used to resume an existing operation
     */
    resumeFrom?: string;
}

/**
 * An interface representing the Properties of {@link KeyVaultKey}
 */
export declare interface KeyProperties {
    /**
     * Key identifier.
     */
    id?: string;
    /**
     * The name of the key.
     */
    name: string;
    /**
     * The vault URI.
     */
    vaultUrl: string;
    /**
     * The version of the key. May be undefined.
     */
    version?: string;
    /**
     * Determines whether the object is enabled.
     */
    enabled?: boolean;
    /**
     * Not before date in UTC.
     */
    notBefore?: Date;
    /**
     * Expiry date in UTC.
     */
    expiresOn?: Date;
    /**
     * Application specific metadata in the form of key-value pairs.
     */
    tags?: {
        [propertyName: string]: string;
    };
    /**
     * Creation time in UTC.
     * **NOTE: This property will not be serialized. It can only be populated by
     * the server.**
     */
    readonly createdOn?: Date;
    /**
     * Last updated time in UTC.
     * **NOTE: This property will not be serialized. It can only be populated by
     * the server.**
     */
    readonly updatedOn?: Date;
    /**
     * Reflects the deletion recovery level currently in effect for keys in the current vault.
     * If it contains 'Purgeable' the key can be permanently deleted by a privileged
     * user; otherwise, only the system can purge the key, at the end of the
     * retention interval. Possible values include: 'Purgeable',
     * 'Recoverable+Purgeable', 'Recoverable',
     * 'Recoverable+ProtectedSubscription'
     * **NOTE: This property will not be serialized. It can only be populated by
     * the server.**
     */
    readonly recoveryLevel?: DeletionRecoveryLevel;
    /**
     * The retention dates of the softDelete data.
     * The value should be `>=7` and `<=90` when softDelete enabled.
     * **NOTE: This property will not be serialized. It can only be populated by the server.**
     */
    recoverableDays?: number;
    /**
     * True if the secret's lifetime is managed by
     * key vault. If this is a secret backing a certificate, then managed will be
     * true.
     * **NOTE: This property will not be serialized. It can only be populated by
     * the server.**
     */
    readonly managed?: boolean;
}

/**
 * Defines values for JsonWebKeyType. \
 * {@link KnownJsonWebKeyType} can be used interchangeably with JsonWebKeyType,
 *  this enum contains the known values that the service supports.
 * ### Know values supported by the service
 * **EC**: Elliptic Curve. \
 * **EC-HSM**: Elliptic Curve with a private key which is not exportable from the HSM. \
 * **RSA**: RSA (https://tools.ietf.org/html/rfc3447) \
 * **RSA-HSM**: RSA with a private key which is not exportable from the HSM. \
 * **oct**: Octet sequence (used to represent symmetric keys) \
 * **oct-HSM**: Octet sequence (used to represent symmetric keys) which is not exportable from the HSM.
 */
export declare type KeyType = string;

/**
 * An interface representing a Key Vault Key, with its name, value and {@link KeyProperties}.
 */
export declare interface KeyVaultKey {
    /**
     * The key value.
     */
    key?: JsonWebKey;
    /**
     * The name of the key.
     */
    name: string;
    /**
     * Key identifier.
     */
    id?: string;
    /**
     * JsonWebKey Key Type (kty), as defined in
     * https://tools.ietf.org/html/draft-ietf-jose-json-web-algorithms-40. Possible values include:
     * 'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct', "oct-HSM"
     */
    keyType?: KeyType;
    /**
     * Operations allowed on this key
     */
    keyOperations?: KeyOperation[];
    /**
     * The properties of the key.
     */
    properties: KeyProperties;
}

/**
 * Represents the segments that compose a Key Vault Key Id.
 */
export declare interface KeyVaultKeyIdentifier {
    /**
     * The complete representation of the Key Vault Key Id. For example:
     *
     *   https://<keyvault-name>.vault.azure.net/keys/<key-name>/<unique-version-id>
     *
     */
    sourceId: string;
    /**
     * The URL of the Azure Key Vault instance to which the Key belongs.
     */
    vaultUrl: string;
    /**
     * The version of Key Vault Key. Might be undefined.
     */
    version?: string;
    /**
     * The name of the Key Vault Key.
     */
    name: string;
}

/**
 * Supported algorithms for key wrapping/unwrapping
 */
export declare type KeyWrapAlgorithm = "A128KW" | "A192KW" | "A256KW" | "RSA-OAEP" | "RSA-OAEP-256" | "RSA1_5";

/** Known values of {@link DeletionRecoveryLevel} that the service accepts. */
export declare const enum KnownDeletionRecoveryLevel {
    /** Denotes a vault state in which deletion is an irreversible operation, without the possibility for recovery. This level corresponds to no protection being available against a Delete operation; the data is irretrievably lost upon accepting a Delete operation at the entity level or higher (vault, resource group, subscription etc.) */
    Purgeable = "Purgeable",
    /** Denotes a vault state in which deletion is recoverable, and which also permits immediate and permanent deletion (i.e. purge). This level guarantees the recoverability of the deleted entity during the retention interval (90 days), unless a Purge operation is requested, or the subscription is cancelled. System wil permanently delete it after 90 days, if not recovered */
    RecoverablePurgeable = "Recoverable+Purgeable",
    /** Denotes a vault state in which deletion is recoverable without the possibility for immediate and permanent deletion (i.e. purge). This level guarantees the recoverability of the deleted entity during the retention interval(90 days) and while the subscription is still available. System wil permanently delete it after 90 days, if not recovered */
    Recoverable = "Recoverable",
    /** Denotes a vault and subscription state in which deletion is recoverable within retention interval (90 days), immediate and permanent deletion (i.e. purge) is not permitted, and in which the subscription itself  cannot be permanently canceled. System wil permanently delete it after 90 days, if not recovered */
    RecoverableProtectedSubscription = "Recoverable+ProtectedSubscription",
    /** Denotes a vault state in which deletion is recoverable, and which also permits immediate and permanent deletion (i.e. purge when 7<= SoftDeleteRetentionInDays < 90). This level guarantees the recoverability of the deleted entity during the retention interval, unless a Purge operation is requested, or the subscription is cancelled. */
    CustomizedRecoverablePurgeable = "CustomizedRecoverable+Purgeable",
    /** Denotes a vault state in which deletion is recoverable without the possibility for immediate and permanent deletion (i.e. purge when 7<= SoftDeleteRetentionInDays < 90).This level guarantees the recoverability of the deleted entity during the retention interval and while the subscription is still available. */
    CustomizedRecoverable = "CustomizedRecoverable",
    /** Denotes a vault and subscription state in which deletion is recoverable, immediate and permanent deletion (i.e. purge) is not permitted, and in which the subscription itself cannot be permanently canceled when 7<= SoftDeleteRetentionInDays < 90. This level guarantees the recoverability of the deleted entity during the retention interval, and also reflects the fact that the subscription itself cannot be cancelled. */
    CustomizedRecoverableProtectedSubscription = "CustomizedRecoverable+ProtectedSubscription"
}

/** Known values of {@link JsonWebKeyEncryptionAlgorithm} that the service accepts. */
export declare const enum KnownEncryptionAlgorithms {
    /** Encryption Algorithm - RSA-OAEP */
    RSAOaep = "RSA-OAEP",
    /** Encryption Algorithm - RSA-OAEP-256 */
    RSAOaep256 = "RSA-OAEP-256",
    /** Encryption Algorithm - RSA1_5 */
    RSA15 = "RSA1_5",
    /** Encryption Algorithm - A128GCM */
    A128GCM = "A128GCM",
    /** Encryption Algorithm - A192GCM */
    A192GCM = "A192GCM",
    /** Encryption Algorithm - A256GCM */
    A256GCM = "A256GCM",
    /** Encryption Algorithm - A128KW */
    A128KW = "A128KW",
    /** Encryption Algorithm - A192KW */
    A192KW = "A192KW",
    /** Encryption Algorithm - A256KW */
    A256KW = "A256KW",
    /** Encryption Algorithm - A128CBC */
    A128CBC = "A128CBC",
    /** Encryption Algorithm - A192CBC */
    A192CBC = "A192CBC",
    /** Encryption Algorithm - A256CBC */
    A256CBC = "A256CBC",
    /** Encryption Algorithm - A128CBCPAD */
    A128Cbcpad = "A128CBCPAD",
    /** Encryption Algorithm - A192CBCPAD */
    A192Cbcpad = "A192CBCPAD",
    /** Encryption Algorithm - A256CBCPAD */
    A256Cbcpad = "A256CBCPAD"
}

/** Known values of {@link JsonWebKeyCurveName} that the service accepts. */
export declare const enum KnownKeyCurveNames {
    /** The NIST P-256 elliptic curve, AKA SECG curve SECP256R1. */
    P256 = "P-256",
    /** The NIST P-384 elliptic curve, AKA SECG curve SECP384R1. */
    P384 = "P-384",
    /** The NIST P-521 elliptic curve, AKA SECG curve SECP521R1. */
    P521 = "P-521",
    /** The SECG SECP256K1 elliptic curve. */
    P256K = "P-256K"
}

/** Known values of {@link JsonWebKeyOperation} that the service accepts. */
export declare const enum KnownKeyOperations {
    /** Key operation - encrypt */
    Encrypt = "encrypt",
    /** Key operation - decrypt */
    Decrypt = "decrypt",
    /** Key operation - sign */
    Sign = "sign",
    /** Key operation - verify */
    Verify = "verify",
    /** Key operation - wrapKey */
    WrapKey = "wrapKey",
    /** Key operation - unwrapKey */
    UnwrapKey = "unwrapKey",
    /** Key operation - import */
    Import = "import"
}

/** Known values of {@link JsonWebKeyType} that the service accepts. */
export declare const enum KnownKeyTypes {
    /** Elliptic Curve. */
    EC = "EC",
    /** Elliptic Curve with a private key which is not exportable from the HSM. */
    ECHSM = "EC-HSM",
    /** RSA (https://tools.ietf.org/html/rfc3447) */
    RSA = "RSA",
    /** RSA with a private key which is not exportable from the HSM. */
    RSAHSM = "RSA-HSM",
    /** Octet sequence (used to represent symmetric keys) */
    Oct = "oct",
    /** Octet sequence (used to represent symmetric keys) which is not exportable from the HSM. */
    OctHSM = "oct-HSM"
}

/** Known values of {@link JsonWebKeySignatureAlgorithm} that the service accepts. */
export declare const enum KnownSignatureAlgorithms {
    /** RSASSA-PSS using SHA-256 and MGF1 with SHA-256, as described in https://tools.ietf.org/html/rfc7518 */
    PS256 = "PS256",
    /** RSASSA-PSS using SHA-384 and MGF1 with SHA-384, as described in https://tools.ietf.org/html/rfc7518 */
    PS384 = "PS384",
    /** RSASSA-PSS using SHA-512 and MGF1 with SHA-512, as described in https://tools.ietf.org/html/rfc7518 */
    PS512 = "PS512",
    /** RSASSA-PKCS1-v1_5 using SHA-256, as described in https://tools.ietf.org/html/rfc7518 */
    RS256 = "RS256",
    /** RSASSA-PKCS1-v1_5 using SHA-384, as described in https://tools.ietf.org/html/rfc7518 */
    RS384 = "RS384",
    /** RSASSA-PKCS1-v1_5 using SHA-512, as described in https://tools.ietf.org/html/rfc7518 */
    RS512 = "RS512",
    /** Reserved */
    Rsnull = "RSNULL",
    /** ECDSA using P-256 and SHA-256, as described in https://tools.ietf.org/html/rfc7518. */
    ES256 = "ES256",
    /** ECDSA using P-384 and SHA-384, as described in https://tools.ietf.org/html/rfc7518 */
    ES384 = "ES384",
    /** ECDSA using P-521 and SHA-512, as described in https://tools.ietf.org/html/rfc7518 */
    ES512 = "ES512",
    /** ECDSA using P-256K and SHA-256, as described in https://tools.ietf.org/html/rfc7518 */
    ES256K = "ES256K"
}

/**
 * An interface representing optional parameters for KeyClient paged operations passed to {@link listDeletedKeys}.
 */
export declare interface ListDeletedKeysOptions extends coreHttp.OperationOptions {
}

/**
 * An interface representing optional parameters for KeyClient paged operations passed to {@link listPropertiesOfKeys}.
 */
export declare interface ListPropertiesOfKeysOptions extends coreHttp.OperationOptions {
}

/**
 * An interface representing optional parameters for KeyClient paged operations passed to {@link listPropertiesOfKeyVersions}.
 */
export declare interface ListPropertiesOfKeyVersionsOptions extends coreHttp.OperationOptions {
}

/**
 * The \@azure/logger configuration for this package.
 */
export declare const logger: import("@azure/logger").AzureLogger;
export { PagedAsyncIterableIterator }
export { PageSettings }

/**
 * Parses the given Key Vault Key Id. An example is:
 *
 *   https://<keyvault-name>.vault.azure.net/keys/<key-name>/<unique-version-id>
 *
 * On parsing the above Id, this function returns:
 *```ts
 *   {
 *      sourceId: "https://<keyvault-name>.vault.azure.net/keys/<key-name>/<unique-version-id>",
 *      vaultUrl: "https://<keyvault-name>.vault.azure.net",
 *      version: "<unique-version-id>",
 *      name: "<key-name>"
 *   }
 *```
 * @param id - The Id of the Key Vault Key.
 */
export declare function parseKeyVaultKeyIdentifier(id: string): KeyVaultKeyIdentifier;
export { PipelineOptions }
export { PollerLike }
export { PollOperationState }

/**
 * Options for {@link purgeDeletedKey}.
 */
export declare interface PurgeDeletedKeyOptions extends coreHttp.OperationOptions {
}

/**
 * Options for {@link restoreKeyBackup}.
 */
export declare interface RestoreKeyBackupOptions extends coreHttp.OperationOptions {
}

/**
 * Decryption parameters for RSA encryption algorithms.
 */
export declare interface RsaDecryptParameters {
    /**
     * The encryption algorithm to use.
     */
    algorithm: RsaEncryptionAlgorithm;
    /**
     * The ciphertext to decrypt.
     */
    ciphertext: Uint8Array;
}

/**
 * A union type representing all supported RSA encryption algorithms.
 */
export declare type RsaEncryptionAlgorithm = "RSA1_5" | "RSA-OAEP" | "RSA-OAEP-256";

/**
 * Encryption parameters for RSA encryption algorithms.
 */
export declare interface RsaEncryptParameters {
    /**
     * The encryption algorithm to use.
     */
    algorithm: RsaEncryptionAlgorithm;
    /**
     * The plain text to encrypt.
     */
    plaintext: Uint8Array;
}

/**
 * Defines values for JsonWebKeySignatureAlgorithm. \
 * {@link KnownJsonWebKeySignatureAlgorithm} can be used interchangeably with JsonWebKeySignatureAlgorithm,
 *  this enum contains the known values that the service supports.
 * ### Know values supported by the service
 * **PS256**: RSASSA-PSS using SHA-256 and MGF1 with SHA-256, as described in https://tools.ietf.org/html/rfc7518 \
 * **PS384**: RSASSA-PSS using SHA-384 and MGF1 with SHA-384, as described in https://tools.ietf.org/html/rfc7518 \
 * **PS512**: RSASSA-PSS using SHA-512 and MGF1 with SHA-512, as described in https://tools.ietf.org/html/rfc7518 \
 * **RS256**: RSASSA-PKCS1-v1_5 using SHA-256, as described in https://tools.ietf.org/html/rfc7518 \
 * **RS384**: RSASSA-PKCS1-v1_5 using SHA-384, as described in https://tools.ietf.org/html/rfc7518 \
 * **RS512**: RSASSA-PKCS1-v1_5 using SHA-512, as described in https://tools.ietf.org/html/rfc7518 \
 * **RSNULL**: Reserved \
 * **ES256**: ECDSA using P-256 and SHA-256, as described in https://tools.ietf.org/html/rfc7518. \
 * **ES384**: ECDSA using P-384 and SHA-384, as described in https://tools.ietf.org/html/rfc7518 \
 * **ES512**: ECDSA using P-521 and SHA-512, as described in https://tools.ietf.org/html/rfc7518 \
 * **ES256K**: ECDSA using P-256K and SHA-256, as described in https://tools.ietf.org/html/rfc7518
 */
export declare type SignatureAlgorithm = string;

/**
 * Options for {@link sign}.
 */
export declare interface SignOptions extends CryptographyOptions {
}

/**
 * Result of the {@link sign} operation.
 */
export declare interface SignResult {
    /**
     * Result of the {@link sign} operation in bytes.
     */
    result: Uint8Array;
    /**
     * The ID of the Key Vault Key used to sign the data.
     */
    keyID?: string;
    /**
     * The {@link EncryptionAlgorithm} used to sign the data.
     */
    algorithm: SignatureAlgorithm;
}

/**
 * Options for {@link unwrapKey}.
 */
export declare interface UnwrapKeyOptions extends CryptographyOptions {
}

/**
 * Result of the {@link unwrap} operation.
 */
export declare interface UnwrapResult {
    /**
     * Result of the {@link unwrap} operation in bytes.
     */
    result: Uint8Array;
    /**
     * The ID of the Key Vault Key used to unwrap the data.
     */
    keyID?: string;
    /**
     * The {@link KeyWrapAlgorithm} used to unwrap the data.
     */
    algorithm: KeyWrapAlgorithm;
}

/**
 * Options for {@link updateKeyProperties}.
 */
export declare interface UpdateKeyPropertiesOptions extends coreHttp.OperationOptions {
    /**
     * Json web key operations. For more
     * information on possible key operations, see KeyOperation.
     */
    keyOps?: KeyOperation[];
    /**
     * Determines whether the object is enabled.
     */
    enabled?: boolean;
    /**
     * Not before date in UTC.
     */
    notBefore?: Date;
    /**
     * Expiry date in UTC.
     */
    expiresOn?: Date;
    /**
     * Application specific metadata in the form of key-value pairs.
     */
    tags?: {
        [propertyName: string]: string;
    };
}

/**
 * Options for {@link verifyData}
 */
export declare interface VerifyDataOptions extends CryptographyOptions {
}

/**
 * Options for {@link verify}.
 */
export declare interface VerifyOptions extends CryptographyOptions {
}

/**
 * Result of the {@link verify} operation.
 */
export declare interface VerifyResult {
    /**
     * Result of the {@link verify} operation in bytes.
     */
    result: boolean;
    /**
     * The ID of the Key Vault Key used to verify the data.
     */
    keyID?: string;
}

/**
 * Options for {@link wrapKey}.
 */
export declare interface WrapKeyOptions extends CryptographyOptions {
}

/**
 * Result of the {@link wrap} operation.
 */
export declare interface WrapResult {
    /**
     * Result of the {@link wrap} operation in bytes.
     */
    result: Uint8Array;
    /**
     * The ID of the Key Vault Key used to wrap the data.
     */
    keyID?: string;
    /**
     * The {@link EncryptionAlgorithm} used to wrap the data.
     */
    algorithm: KeyWrapAlgorithm;
}

export { }

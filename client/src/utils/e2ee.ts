export class E2eeManger {
	private static _instance: E2eeManger;
	static isInitialized = false;

	static get instance() {
		if (!E2eeManger._instance) {
			E2eeManger._instance = new E2eeManger();
		}
		return E2eeManger._instance;
	}

	cryptoPair: CryptoKeyPair | null = null;

	async saveKeyPair() {
		if (!this.cryptoPair) {
			throw new Error("No crypto pair");
		}
		const publicKey = await crypto.subtle.exportKey(
			"spki",
			this.cryptoPair?.publicKey
		);
		const privateKey = await crypto.subtle.exportKey(
			"pkcs8",
			this.cryptoPair?.privateKey
		);

		const keyPair = {
			publicKey: Buffer.from(publicKey).toString("base64"),
			privateKey: Buffer.from(privateKey).toString("base64"),
		};

		localStorage.setItem("keyPair", JSON.stringify(keyPair));
	}

	async getPublicKey() {
		if (!localStorage.getItem("keyPair")) {
			await this.generateKeyPair();
		}
		const parsedKeyPair = JSON.parse(localStorage.getItem("keyPair")!);
		return parsedKeyPair.publicKey;
	}

	async generateKeyPair() {
		if (E2eeManger.isInitialized) {
			console.log("Already initialized");
			return;
		}

		console.log("Initializing crypto");

		E2eeManger.isInitialized = true;

		// check if key pair exists in local storage
		const keyPair = localStorage.getItem("keyPair");

		if (keyPair) {
			const parsedKeyPair = JSON.parse(keyPair);
			const publicKey = await window.crypto.subtle.importKey(
				"spki",
				Buffer.from(parsedKeyPair.publicKey, "base64"),
				{
					name: "RSA-OAEP",
					hash: "SHA-256",
				},
				true,
				["encrypt"]
			);
			const privateKey = await window.crypto.subtle.importKey(
				"pkcs8",
				Buffer.from(parsedKeyPair.privateKey, "base64"),
				{
					name: "RSA-OAEP",
					hash: "SHA-256",
				},
				true,
				["decrypt"]
			);
			this.cryptoPair = {
				publicKey,
				privateKey,
			};
			return;
		}

		this.cryptoPair = await window.crypto.subtle.generateKey(
			{
				name: "RSA-OAEP",
				modulusLength: 2048,
				publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
				hash: "SHA-256",
			},
			true,
			["encrypt", "decrypt"]
		);

		await this.saveKeyPair();
	}

	async encryptMessage(message: string, publicKey: CryptoKey) {
		const encoded = new TextEncoder().encode(message);
		const encrypted = await window.crypto.subtle.encrypt(
			{
				name: "RSA-OAEP",
			},
			publicKey,
			encoded
		);
		return Buffer.from(encrypted).toString("base64");
	}

	async decryptMessage(message: string) {
		if (!this.cryptoPair) {
			throw new Error("No crypto pair");
		}

		const decoded = Buffer.from(message, "base64");
		const decrypted = await window.crypto.subtle.decrypt(
			{
				name: "RSA-OAEP",
			},
			this.cryptoPair.privateKey,
			decoded
		);
		return new TextDecoder().decode(decrypted);
	}
}
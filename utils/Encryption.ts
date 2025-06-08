// utils/crypto.js
import CryptoJS from 'crypto-js';

const secretKey = process.env.CRYPTO_SECRET_KEY as string;
console.log(secretKey);

if (!secretKey) {
    throw new Error('CRYPTO_SECRET_KEY environment variable is not defined');
}
const encrypt = async (text: any) => {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
};

const decrypt = async (ciphertext: any) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};
export { encrypt, decrypt }
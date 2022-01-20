const {
  Account,
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL
} = require('@solana/web3.js');

const newPair = new Keypair(); // Generate a new keypair which holds the private and public keys
console.log('newpair object: ', newPair);

// Storing the public and private key
const publicKey = new PublicKey(newPair._keypair.publicKey).toString(); // Convert the public key to a string
const secretKey = newPair._keypair.secretKey; // Get the secret key of type Uint8Array

// View account balance by using getBalance() method inside connection class
const getWalletBalance = async () => {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Creating a wallet object from secretKey
    const myWallet = await Keypair.fromSecretKey(secretKey);
    const walletBalance = await connection.getBalance(
      new PublicKey(myWallet.publicKey)
    );
    console.log(
      `Wallet balance for wallet address ${publicKey}: ${
        parseInt(walletBalance) / LAMPORTS_PER_SOL
      }SOL`
    );
  } catch (error) {
    console.log(error);
  }
};

//Airdropping SOL; (At most 2 SOL can be airdropped at a time)
const airDropSol = async () => {
  try {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const walletKeyPair = await Keypair.fromSecretKey(secretKey);
    console.log('Airdropping SOL');
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(walletKeyPair.publicKey),
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
    console.log(err);
  }
};

const driverFunction = async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
};

driverFunction();

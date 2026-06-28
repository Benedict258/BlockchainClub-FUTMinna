import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { fromB64 } from "@mysten/sui/utils";

const network = (process.env.SUI_NETWORK || "testnet") as "testnet" | "mainnet";
const client = new SuiClient({ url: getFullnodeUrl(network) });
const packageId = process.env.SUI_PACKAGE_ID!;
const adminCapId = process.env.SUI_ADMIN_CAP_OBJECT_ID!;

function getAdminKeypair(): Ed25519Keypair {
  const key = process.env.SUI_ADMIN_PRIVATE_KEY!;
  return Ed25519Keypair.fromSecretKey(fromB64(key).slice(1));
}

const MODULE = "club_registry";

export async function registerStudentOnChain(
  studentAddress: string,
): Promise<{ digest: string; entryObjectId: string }> {
  const keypair = getAdminKeypair();
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::${MODULE}::register_entry`,
    arguments: [tx.object(adminCapId), tx.pure.address(studentAddress)],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: { showEffects: true },
  });

  const entryObjectId =
    result.effects?.created?.[0]?.reference?.objectId ?? "";

  return { digest: result.digest, entryObjectId };
}

export async function awardPointsOnChain(
  studentAddress: string,
  entryObjectId: string,
  category: number,
  amount: number,
): Promise<string> {
  const keypair = getAdminKeypair();
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::${MODULE}::award_points`,
    arguments: [
      tx.object(adminCapId),
      tx.object(entryObjectId),
      tx.pure.u8(category),
      tx.pure.u64(amount),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });

  return result.digest;
}

export async function mintBadgeOnChain(
  studentAddress: string,
  badgeType: number,
  name: string,
  description: string,
): Promise<string> {
  const keypair = getAdminKeypair();
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::${MODULE}::mint_badge`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.address(studentAddress),
      tx.pure.u8(badgeType),
      tx.pure.vector("u8", new TextEncoder().encode(name)),
      tx.pure.vector("u8", new TextEncoder().encode(description)),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });

  return result.digest;
}

export async function issueCertificateOnChain(
  studentAddress: string,
  tier: number,
  track: string,
  cohortYear: number,
  portfolioUrl: string,
): Promise<string> {
  const keypair = getAdminKeypair();
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::${MODULE}::issue_certificate`,
    arguments: [
      tx.object(adminCapId),
      tx.pure.address(studentAddress),
      tx.pure.u8(tier),
      tx.pure.vector("u8", new TextEncoder().encode(track)),
      tx.pure.u16(cohortYear),
      tx.pure.vector("u8", new TextEncoder().encode(portfolioUrl)),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });

  return result.digest;
}

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

describe("onchain_rate_limiter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.OnchainRateLimiter as Program;
  const authority = provider.wallet;
  const subject = anchor.web3.Keypair.generate();
  const registryName = "public-rpc";

  const registry = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("registry"), authority.publicKey.toBuffer(), Buffer.from(registryName)],
    program.programId,
  )[0];

  const bucket = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("bucket"), registry.toBuffer(), subject.publicKey.toBuffer()],
    program.programId,
  )[0];

  it("creates a registry and quota bucket", async () => {
    await program.methods
      .initializeRegistry(registryName, new anchor.BN(60))
      .accounts({
        registry,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .createBucket(subject.publicKey, 10, null)
      .accounts({
        registry,
        bucket,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const account = await program.account.bucket.fetch(bucket);
    expect(account.limit).to.equal(10);
    expect(account.remaining).to.equal(10);
  });

  it("decrements quota when the subject consumes units", async () => {
    await provider.connection.requestAirdrop(subject.publicKey, anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .consume(3)
      .accounts({
        bucket,
        subject: subject.publicKey,
      })
      .signers([subject])
      .rpc();

    const account = await program.account.bucket.fetch(bucket);
    expect(account.remaining).to.equal(7);
  });
});

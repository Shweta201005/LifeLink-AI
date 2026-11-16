import { network } from "hardhat";

async function main() {
  const { ethers } = await network.create({
    network: "sepolia",
  });

  const LifeLink = await ethers.getContractFactory("LifeLink");

  const lifeLink = await LifeLink.deploy();

  await lifeLink.waitForDeployment();

  console.log(
    "LifeLink deployed to:",
    await lifeLink.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
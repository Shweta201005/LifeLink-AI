import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await
network.create();

describe("Lifelink Smart Contract", function () {

    async function deployLifeLink() {
        const [owner, hospital, bloodBank, stranger] =
            await ethers.getSigners();

        const lifeLink = await ethers.deployContract("LifeLink");
        await lifeLink.waitForDeployment();

        return {
            lifeLink,
            owner,
            hospital,
            bloodBank,
            stranger
        };
    }

    it("Should register a hospital", async function () {
        const { lifeLink, owner, hospital } =
            await deployLifeLink();

        await lifeLink.connect(owner).registerHospital(
            hospital.address
        );

        expect(
            await lifeLink.roles(hospital.address)
        ).to.equal(1n);
    });

    it("Should register a blood bank", async function () {
        const { lifeLink, owner, bloodBank } =
            await deployLifeLink();

        await lifeLink.connect(owner).registerBloodBank(
            bloodBank.address
        );

        expect(
            await lifeLink.roles(bloodBank.address)
        ).to.equal(2n);
    });

    it("Should prevent unauthorized registration", async function () {
        const { lifeLink, hospital, stranger } =
            await deployLifeLink();

        await expect(
            lifeLink.connect(stranger).registerHospital(
                hospital.address
            )
        ).to.be.revertedWith("Only owner allowed");
    });

    it("Should update blood inventory", async function () {
        const { lifeLink, owner, bloodBank } =
            await deployLifeLink();

        const bloodGroup = ethers.encodeBytes32String("O_NEGATIVE");

        await lifeLink.connect(owner).registerBloodBank(
            bloodBank.address
        );

        await lifeLink.connect(bloodBank).updateInventory(
            bloodGroup,
            10
        );

        expect(
            await lifeLink.getInventory(
                bloodBank.address,
                bloodGroup
            )
        ).to.equal(10n);
    });

    it("Should create an emergency blood request", async function () {
        const { lifeLink, owner, hospital } =
            await deployLifeLink();

        const bloodGroup = ethers.encodeBytes32String("O_NEGATIVE");

        await lifeLink.connect(owner).registerHospital(
            hospital.address
        );

        await lifeLink.connect(hospital).createRequest(
            bloodGroup,
            3
        );

        const request = await lifeLink.getRequest(1);

        expect(request.hospital).to.equal(hospital.address);
        expect(request.units).to.equal(3n);
        expect(request.status).to.equal(1n);
    });

    it("Should reserve blood and prevent duplicate reservation", async function () {
        const {
            lifeLink,
            owner,
            hospital,
            bloodBank
        } = await deployLifeLink();

        const bloodGroup = ethers.encodeBytes32String("O_NEGATIVE");

        await lifeLink.connect(owner).registerHospital(
            hospital.address
        );

        await lifeLink.connect(owner).registerBloodBank(
            bloodBank.address
        );

        await lifeLink.connect(bloodBank).updateInventory(
            bloodGroup,
            10
        );

        await lifeLink.connect(hospital).createRequest(
            bloodGroup,
            3
        );

        await lifeLink.connect(bloodBank).reserveRequest(1);

        expect(
            await lifeLink.getInventory(
                bloodBank.address,
                bloodGroup
            )
        ).to.equal(7n);

        await expect(
            lifeLink.connect(bloodBank).reserveRequest(1)
        ).to.be.revertedWith("Request not open");
    });

    it("Should complete dispatch and receipt", async function () {
        const {
            lifeLink,
            owner,
            hospital,
            bloodBank
        } = await deployLifeLink();

        const bloodGroup = ethers.encodeBytes32String("O_NEGATIVE");

        await lifeLink.connect(owner).registerHospital(
            hospital.address
        );

        await lifeLink.connect(owner).registerBloodBank(
            bloodBank.address
        );

        await lifeLink.connect(bloodBank).updateInventory(
            bloodGroup,
            10
        );

        await lifeLink.connect(hospital).createRequest(
            bloodGroup,
            2
        );

        await lifeLink.connect(bloodBank).reserveRequest(1);

        await lifeLink.connect(bloodBank).confirmDispatch(1);

        await lifeLink.connect(hospital).confirmReceipt(1);

        const request = await lifeLink.getRequest(1);

        expect(request.status).to.equal(4n);
    });

});
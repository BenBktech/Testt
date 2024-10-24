import { expect, assert } from "chai";
import hre from "hardhat";
import { Bank } from "../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"; 
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"

describe('Test Bank contract', function() {
    let owner: HardhatEthersSigner;
    let addr1: HardhatEthersSigner;
    let addr2: HardhatEthersSigner;
    let bank: Bank;

    async function deployBankFixture() {
        [owner, addr1, addr2] = await hre.ethers.getSigners()
        let contract = await hre.ethers.getContractFactory('Bank')
        bank = await contract.deploy()
        return { bank, owner, addr1, addr2 };
    }

    async function deployBankWithDepositFixture() {
        const { bank, owner, addr1, addr2 } = await deployBankFixture();
        let etherQuantity = hre.ethers.parseEther('0.1')
        let transaction = await bank.deposit({ value: etherQuantity })
        await transaction.wait()
        return { bank, owner, addr1, addr2 };
    }
    //Test
    describe('Initialization', function() {
        beforeEach(async function() {
            ({ bank, owner, addr1, addr2 } = await loadFixture(deployBankFixture));
        });

        it('should deploy the smart contract', async function() {
            let theOwner = await bank.owner()
            assert.equal(owner.address, theOwner)
        })
    })

    describe('Deposit', function() {
        beforeEach(async function() {
            ({ bank, owner, addr1, addr2 } = await loadFixture(deployBankFixture));
        });

        it('should NOT deposit Ethers on the Bank smart contract if not the owner', async function() {
            let etherQuantity = hre.ethers.parseEther('0.1')
            await expect(bank.connect(addr1).deposit({ value: etherQuantity })).to.be.revertedWithCustomError(
                bank,
                "OwnableUnauthorizedAccount"
            ).withArgs(
                addr1.address
            )
        })

        it('should NOT deposit Ethers if not enough funds provided', async function() {
            let etherQuantity = hre.ethers.parseEther('0.09')
            await expect(bank.deposit({ value: etherQuantity })).to.be.revertedWith('Not enough funds provided')
        })

        it('should deposit Ethers if Owner and if enough funds provided', async function() {
            let weiQuantity = hre.ethers.parseEther('0.19') 
            await expect(bank.deposit({ value: weiQuantity }))
            .to.emit(
                bank,
                'Deposit'
            )
            .withArgs(
                owner.address,
                weiQuantity
            )
            let balanceContract = await hre.ethers.provider.getBalance(bank.target);
            assert(balanceContract === weiQuantity)
        })
    })

    describe('Withdraw', function() {
        beforeEach(async function() {
            ({ bank, owner, addr1, addr2 } = await loadFixture(deployBankWithDepositFixture));
        });

        it('should NOT withdraw if NOT the owner', async function() {
            let etherQuantity = hre.ethers.parseEther('0.1')
            await expect(bank.connect(addr1).withdraw(etherQuantity)).to.be.revertedWithCustomError(
                bank,
                "OwnableUnauthorizedAccount"
            ).withArgs(
                addr1.address
            )
        })

        it('should NOT withdraw if the owner try to withdraw too many ethers', async function() {
            let etherQuantity = hre.ethers.parseEther('0.2')
            await expect(bank.withdraw(etherQuantity)).to.be.revertedWith('You cannot withdraw this amount')
        })

        it('should withdraw if the owner try to withdraw and the amount is correct', async function() {
            let etherQuantity = hre.ethers.parseEther('0.05')
            await expect(bank.withdraw(etherQuantity))
            .to.emit(
                bank,
                'Withdraw'
            )
            .withArgs(
                owner.address,
                etherQuantity
            )
            let balance = await hre.ethers.provider.getBalance(bank.target)
            assert(balance.toString() === "50000000000000000")
        })
    })
})

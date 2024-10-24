// import { expect, assert } from "chai";
// import hre from "hardhat";
// import { SimpleStorage } from "../../typechain-types";

// describe("Test SimpleStorage Contract", function () {

//   let deployedContract: SimpleStorage;
//   let owner, addr1, addr2;

//   beforeEach(async function() {
//     // Contracts are deployed using the first signer/account by default
//     [owner, addr1, addr2] = await hre.ethers.getSigners();

//     const SimpleStorage = await hre.ethers.deployContract("SimpleStorage");
//     deployedContract = SimpleStorage;
//   })

//   describe('Initialization', function() {
//     it('should get the number and the number should be equal to 0', async function() {
//       let storedData = await deployedContract.get();
//       assert(Number(storedData) === 0);
//     })
//   })

//   describe('Set and Get', function() {
//     it('should set the number', async function() {
//       let transaction = await deployedContract.set(777);
//       await transaction.wait(); // On attend un bloc
//       let storedData = await deployedContract.get();
//       assert(Number(storedData) === 777);
//     })

//     it('should get the number', async function() {
//       let storedData = await deployedContract.get();
//       assert(Number(storedData) === 0);
//     })
//   })
// });
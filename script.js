const CONTRACT_ADDRESS = "0x9959f06d4bee982d68CC7329feb88a4EcaF9596A";

const CONTRACT_ABI = [
 "function registerHospital(address hospital) external",
 "function registerBloodBank(address bloodBank) external",
 "function createRequest(bytes32 bloodGroup,uint256 units) external returns(uint256)",
 "function updateInventory(bytes32 bloodGroup,uint256 units) external",
 "function reserveRequest(uint256 requestId) external",
 "function confirmDispatch(uint256 requestId) external",
 "function confirmReceipt(uint256 requestId) external",
 "function getInventory(address bloodBank,bytes32 bloodGroup) external view returns(uint256)",
 "function getRequest(uint256 requestId) external view returns(tuple(uint256 requestId,address hospital,address bloodBank,bytes32 bloodGroup,uint256 units,uint8 status))"
];

let provider;
let signer;
let contract;

const walletButton = document.getElementById("connectWallet");

function showPage(page, button) {
 document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
 document.getElementById(page).classList.add("active");

 document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
 if (button) button.classList.add("active");

 const names = {
  home:"Dashboard",
  services:"Services",
  admin:"Admin Registration",
  hospital:"Hospital Portal",
  bloodbank:"Blood Bank Portal",
  tracking:"Request Tracking",
  ai:"AI Predictions"
 };
 document.getElementById("crumb").textContent = names[page] || page;
}

function message(text) {
 alert(text);
}

function showResult(id, text) {
 const element = document.getElementById(id);
 if (!element) return;
 element.style.display = "block";
 element.textContent = text;
}

function bytes32(value) {
 return ethers.encodeBytes32String(value);
}

async function connectWallet() {
 try {
  if (!window.ethereum) {
   return message("Please install MetaMask.");
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== 11155111) {
   contract = null;
   return message("Please select Sepolia network in MetaMask.");
  }

  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const address = await signer.getAddress();
  walletButton.textContent = "Connected: " + address.slice(0,6) + "..." + address.slice(-4);

  message("Wallet connected successfully!");
 } catch (error) {
  console.error(error);
  message(error.shortMessage || error.message);
 }
}

async function requireContract() {
 if (!contract) {
  message("Please connect your MetaMask wallet first.");
  return false;
 }
 return true;
}

async function sendTransaction(action, successText) {
 try {
  const tx = await action();
  message("Please confirm the transaction in MetaMask.");
  await tx.wait();
  message(successText);
 } catch (error) {
  console.error(error);
  message(error.shortMessage || error.reason || error.message);
 }
}

async function registerHospital() {
 if (!(await requireContract())) return;

 const address = document.getElementById("hospitalAddress").value.trim();
 if (!ethers.isAddress(address)) return message("Enter a valid hospital wallet address.");

 await sendTransaction(
  () => contract.registerHospital(address),
  "Hospital registered successfully!"
 );
}

async function registerBloodBank() {
 if (!(await requireContract())) return;

 const address = document.getElementById("bloodBankAddress").value.trim();
 if (!ethers.isAddress(address)) return message("Enter a valid blood bank wallet address.");

 await sendTransaction(
  () => contract.registerBloodBank(address),
  "Blood Bank registered successfully!"
 );
}

async function createBloodRequest() {
 if (!(await requireContract())) return;

 const group = document.getElementById("bloodGroup").value;
 const units = Number(document.getElementById("units").value);

 if (!Number.isInteger(units) || units <= 0) {
  return message("Enter a valid number of units.");
 }

 await sendTransaction(
  () => contract.createRequest(bytes32(group), units),
  "Blood request created successfully!"
 );
}

async function updateBloodInventory() {
 if (!(await requireContract())) return;

 const group = document.getElementById("inventoryGroup").value;
 const units = Number(document.getElementById("inventoryUnits").value);

 if (!Number.isInteger(units) || units < 0) {
  return message("Enter a valid inventory quantity.");
 }

 await sendTransaction(
  () => contract.updateInventory(bytes32(group), units),
  "Blood inventory updated successfully!"
 );
}

async function reserveBloodRequest() {
 if (!(await requireContract())) return;

 const id = document.getElementById("requestId").value;
 if (!id || Number(id) < 1) return message("Enter a valid request ID.");

 await sendTransaction(
  () => contract.reserveRequest(id),
  "Blood request reserved successfully!"
 );
}

async function confirmBloodDispatch() {
 if (!(await requireContract())) return;

 const id = document.getElementById("dispatchRequestId").value;
 if (!id || Number(id) < 1) return message("Enter a valid request ID.");

 await sendTransaction(
  () => contract.confirmDispatch(id),
  "Blood dispatch confirmed successfully!"
 );
}

async function confirmBloodReceipt() {
 if (!(await requireContract())) return;

 const id = document.getElementById("receiptRequestId").value;
 if (!id || Number(id) < 1) return message("Enter a valid request ID.");

 await sendTransaction(
  () => contract.confirmReceipt(id),
  "Blood receipt confirmed successfully!"
 );
}

async function getBloodRequest() {
 if (!(await requireContract())) return;

 try {
  const id = document.getElementById("viewRequestId").value;
  if (!id || Number(id) < 1) return message("Enter a valid request ID.");

  const r = await contract.getRequest(id);
  const statuses = ["None","Open","Reserved","Dispatched","Received"];

  const details =
   "Request ID: " + r.requestId.toString() + "\n" +
   "Hospital: " + r.hospital + "\n" +
   "Blood Bank: " + r.bloodBank + "\n" +
   "Blood Group: " + ethers.decodeBytes32String(r.bloodGroup) + "\n" +
   "Units: " + r.units.toString() + "\n" +
   "Status: " + (statuses[Number(r.status)] || "Unknown");

  showResult("requestDetails", details);
 } catch (error) {
  console.error(error);
  message(error.shortMessage || error.reason || error.message);
 }
}

walletButton.addEventListener("click", connectWallet);

if (window.ethereum) {
 window.ethereum.on("accountsChanged", () => {
  contract = null;
  signer = null;
  walletButton.textContent = "Connect Wallet";
 });
 window.ethereum.on("chainChanged", () => window.location.reload());
}
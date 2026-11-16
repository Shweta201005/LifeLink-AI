🩸 LifeLink AI

AI-Powered Decentralized Blood Resource Management System

LifeLink AI is a blockchain-based blood resource management system designed to improve coordination between hospitals and blood banks. It combines smart contracts and machine learning to support blood inventory management, request tracking, and shortage prediction.

🚀 Project Overview

The system provides:

- Hospital Portal: Hospitals can submit blood requests.
- Blood Bank Portal: Blood banks can update available blood inventory and reserve requests.
- Blockchain Integration: Smart contracts manage registrations, inventory updates, and request status.
- Request Tracking: Users can track the progress of blood requests.
- AI Blood Shortage Prediction: A machine learning model estimates expected stock levels and provides low-inventory warnings.

🛠️ Technologies Used

- Frontend: HTML, CSS, JavaScript
- Blockchain: Solidity, Ethereum Sepolia
- Development Environment: Hardhat
- Wallet: MetaMask
- Blockchain Library: Ethers.js
- Backend: Python, Flask
- Machine Learning: Scikit-learn

⚙️ Project Structure

📁 Project Structure

```text
LifeLink-AI/
├── contracts/
│   └── LifeLink.sol
├── scripts/
│   ├── deploy.ts
│   └── send-op-tx.ts
├── test/
│   ├── Counter.ts
│   └── LifeLink.ts
├── ignition/
│   └── modules/
├── index.html
├── script.js
├── app.py
├── ai_prediction.py
├── hardhat.config.ts
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

▶️ How to Run

1. Clone the repository

git clone https://github.com/Shweta201005/LifeLink-AI.git
cd LifeLink-AI

2. Install blockchain dependencies

npm install

3. Compile the smart contract

npx hardhat compile

4. Install Python dependencies

python -m pip install flask scikit-learn pandas

5. Start the AI backend

python app.py

6. Open the frontend

Open another terminal in the project folder and run:

python -m http.server 5500

Open "http://localhost:5500" in your browser.

Use MetaMask with the Sepolia test network for blockchain demonstrations.

🔐 Security and Disclaimer

This is an academic prototype intended for demonstration and educational purposes.
It uses testnet blockchain transactions and simulated inventory data.
It is not intended for real-world blood transfusion decisions or medical use.
Medical compatibility and transfusion decisions must always be made by qualified healthcare professionals.

👩‍💻 Project Information

Project: LifeLink AI
Domain: Artificial Intelligence and Blockchain
Repository: "GitHub – LifeLink AI" (https://github.com/Shweta201005/LifeLink-AI)

## 📸 Project Screenshots

### LifeLink AI Website
![Website](Screenshot%202026-11-16%20183912.png)

### AI Blood Shortage Prediction
![AI Prediction](Screenshot%202026-11-16%20184004.png)

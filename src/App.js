const connectBtn = document.getElementById("connectBtn");
const claimBtn = document.getElementById("claimBtn");
const statusText = document.getElementById("status");
const referralText = document.getElementById("referralLink");

let userAddress = null;

async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      userAddress = accounts[0];
      connectBtn.innerText = "Connected";
      claimBtn.disabled = false;
      showReferralLink();
    } catch (err) {
      statusText.innerText = "❌ Wallet connection failed.";
    }
  } else {
    statusText.innerText = "❌ MetaMask not found!";
  }
}

function getReferralCode() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("ref") || null;
}

function showReferralLink() {
  const link = `${window.location.origin}?ref=${userAddress}`;
  referralText.style.display = "block";
  referralText.innerText = `Your Referral Link:\n${link}`;
}

async function claimAirdrop() {
  claimBtn.disabled = true;
  statusText.innerText = "⏳ Claiming airdrop...";

  try {
    const ref = getReferralCode();
    const response = await fetch("https://chc-airdrop-backend.onrender.com/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: userAddress, referrer: ref })
    });

    const data = await response.json();
    if (data.success) {
      statusText.innerText = "✅ Airdrop claimed successfully!";
    } else {
      statusText.innerText = `❌ ${data.message}`;
    }
  } catch (err) {
    statusText.innerText = "❌ Error claiming airdrop.";
  } finally {
    claimBtn.disabled = false;
  }
}

connectBtn.onclick = connectWallet;
claimBtn.onclick = claimAirdrop;

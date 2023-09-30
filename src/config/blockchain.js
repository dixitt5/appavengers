import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "./contract";

const getBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    const balanceInMatic = web3.utils.fromWei(balance, "ether");
    const shortenedValue = balanceInMatic.toString().slice(0, 5);
    return shortenedValue;
  } catch (error) {
    console.error(error);
  }
};

const getEthereumContract = async () => {
  if (ethereum) {
    const web3 = window.web3;
    console.log(web3);
    const networkId = await web3.eth.net.getId();
    console.log(networkId);

    if (networkId) {
      const contract = new web3.eth.Contract(
        NFT_CONTRACT_ABI,
        NFT_CONTRACT_ADDRESS
      );
      return contract;
    } else {
      return null;
    }
  } else {
    console.log("contract not fetched!!");
  }
};

const createNFT = async (uri, price, address) => {
  try {
    const contract = await getEthereumContract();
    console.log(contract);
    const account = address;
    console.log(account);
    const weiValue = window.web3.utils.toWei(price.toString(), "ether");
    console.log(weiValue);

    // const tx = await contract.methods
    //   .createNFT("uri", '2')
    //   .send({ from: account, gas: 3000000 })
    //   .on("transactionHash", function (hash) {
    //     console.log(hash);
    //   })
    //   .on("confirmation", function (confirmationNumber, receipt) {
    //     console.log(receipt);
    //   })
    //   .on("receipt", (receipt) => {
    //     console.log(receipt);
    //   });
    const gasEstimate = await contract.methods
      .createNFT(uri, weiValue)
      .estimateGas({
        from: account,
      });
    console.log(gasEstimate);

    const encode = await contract.methods.createNFT(uri, weiValue).encodeABI();

    const tx = await window.web3.eth.sendTransaction({
      from: account,
      to: NFT_CONTRACT_ADDRESS,
      gas: gasEstimate,
      data: encode,
    });

    return tx;
  } catch (error) {
    console.error(error);
  }
};

const buyToken = async (tokenId, address, price) => {
  try {
    const contract = await getEthereumContract();
    console.log(contract);
    const account = address;
    console.log(account);
    // const weiValue = Web3.utils.toWei(price, "ether");
    // const weiValue = window.web3.utils.toWei(price.toString(), "ether");
    // console.log(weiValue);
    // const mintPrice = window.web3.utils.toWei("0.01", "ether");

    const gasEstimate = await contract.methods.buyToken(tokenId).estimateGas({
      value: window.web3.utils.toWei(price, "ether"),
      from: account,
    });
    console.log(gasEstimate);

    const encode = await contract.methods.buyToken(tokenId).encodeABI();

    const tx = await window.web3.eth.sendTransaction({
      from: account,
      to: NFT_CONTRACT_ADDRESS,
      gas: gasEstimate,
      data: encode,
      value: window.web3.utils.toWei(price, "ether"),
    });

    return tx;
  } catch (error) {
    console.error(error);
  }
};

// const performContribute = async (amount) => {
//   try {
//     amount = window.web3.utils.toWei(amount.toString(), "ether");
//     const contract = await getEthereumContract();
//     const account = getGlobalState("connectedAccount");

//     await contract.methods
//       .payMaintenance()
//       .send({ from: account, value: amount });

//     window.location.reload();
//   } catch (error) {
//     reportError(error);
//     return error;
//   }
// };

// const getInfo = async () => {
//   try {
//     if (!ethereum) return alert("Please install Metamask");

//     const connectedAccount = getGlobalState("connectedAccount");
//     const contract = await getEthereumContract();
//     console.log(contract);
//     // const isStakeholder = await contract.methods
//     //   .isStakeholder()
//     //   .call({ from: connectedAccount });
//     const balance = await contract.methods
//       .daoBalance()
//       .call({ from: connectedAccount });
//     console.log(balance);
//     const tokenBal = await contract.methods
//       .returnTokenBalance(connectedAccount)
//       .call({ from: connectedAccount });
//     setGlobalState("balance", window.web3.utils.fromWei(balance));
//     setGlobalState("mybalance", tokenBal);
//     // setGlobalState("isStakeholder", isStakeholder);
//   } catch (error) {
//     console.error(error);
//   }
// };

// const raiseProposal = async ({ title, description, beneficiary, amount }) => {
//   try {
//     amount = window.web3.utils.toWei(amount.toString(), "ether");
//     const contract = await getEthereumContract();
//     const account = getGlobalState("connectedAccount");

//     await contract.methods
//       .createProposal(title, description, beneficiary, amount)
//       .send({ from: account });

//     window.location.reload();
//   } catch (error) {
//     reportError(error);
//     return error;
//   }
// };

// const getProposals = async () => {
//   try {
//     if (!ethereum) return alert("Please install Metamask");

//     const contract = await getEthereumContract();
//     const proposals = await contract.methods.getProposals().call();
//     setGlobalState("proposals", structuredProposals(proposals));
//   } catch (error) {
//     console.error(error);
//   }
// };

// const structuredProposals = (proposals) => {
//   return proposals
//     .map((proposal) => ({
//       id: proposal.id,
//       amount: window.web3.utils.fromWei(proposal.amount),
//       title: proposal.title,
//       description: proposal.description,
//       paid: proposal.paid,
//       passed: proposal.passed,
//       proposer: proposal.proposer,
//       upvotes: Number(proposal.upvotes),
//       downvotes: Number(proposal.downvotes),
//       beneficiary: proposal.beneficiary,
//       executor: proposal.executor,
//       duration: proposal.duration,
//     }))
//     .reverse();
// };

// const getProposal = async (id) => {
//   try {
//     const proposals = getGlobalState("proposals");
//     return proposals.find((proposal) => proposal.id == id);
//   } catch (error) {
//     reportError(error);
//   }
// };

// const voteOnProposal = async (proposalId, supported) => {
//   try {
//     const contract = await getEthereumContract();
//     const account = getGlobalState("connectedAccount");
//     await contract.methods
//       .performVote(proposalId, supported)
//       .send({ from: account });

//     window.location.reload();
//   } catch (error) {
//     reportError(error);
//   }
// };

// const listVoters = async (id) => {
//   try {
//     const contract = await getEthereumContract();
//     const votes = await contract.methods.getVotesOf(id).call();
//     return votes;
//   } catch (error) {
//     reportError(error);
//   }
// };

// const payoutBeneficiary = async (id) => {
//   try {
//     const contract = await getEthereumContract();
//     const account = getGlobalState("connectedAccount");
//     await contract.methods.payBeneficiary(id).send({ from: account });
//     window.location.reload();
//   } catch (error) {
//     reportError(error);
//   }
// };

// const reportError = (error) => {
//   console.log(JSON.stringify(error), "red");
//   throw new Error("No ethereum object.");
// };

export { createNFT, getBalance, buyToken };

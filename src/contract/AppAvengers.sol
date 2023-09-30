// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AppAvengers is ERC721URIStorage {
    address private contractOwner;
    uint256 private _tokenIds;
    mapping(uint256 => address) public tokenOwner;
    mapping(address => uint256[]) public ownedTokens;
    mapping(uint256 => address) public trackToken;
    mapping(uint256 => uint256) public tokenPrice;

    uint256 public royaltyPercentage = 10; // 10% royalty to creator
    uint256 public transactionCutPercentage = 25; // 2.5% cut to contract

    modifier onlyOwner() {
        require(
            msg.sender == contractOwner,
            "Only the contract owner can call this function"
        );
        _;
    }

    constructor() ERC721("AppAvengers", "APG") {
        contractOwner = msg.sender; // Set the contract owner as the deployer of the contract
    }

    // this will be executing when user does not have a collection created and directly mints an NFT
    function createNFT(
        string memory tokenuri,
        uint256 price
    ) public returns (uint256) {
        _mintNFT(msg.sender, tokenuri);
        tokenPrice[_tokenIds] = price;
        return _tokenIds;
    }

    function _mintNFT(
        address recipient,
        string memory tokenURI
    ) private returns (uint256) {
        _tokenIds++;
        _mint(recipient, _tokenIds);
        _setTokenURI(_tokenIds, tokenURI);

        tokenOwner[_tokenIds] = recipient;
        trackToken[_tokenIds] = recipient;
        ownedTokens[recipient].push(_tokenIds);

        return _tokenIds;
    }

    // Function to get the contract's balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to set the royalty percentage (only owner)
    function setRoyaltyPercentage(uint256 percentage) public onlyOwner {
        royaltyPercentage = percentage;
    }

    // Function to set the transaction cut percentage (only owner)
    function setTransactionCutPercentage(uint256 percentage) public onlyOwner {
        transactionCutPercentage = percentage;
    }

    function buyToken(uint256 _tokenId) public payable {
        uint256 price = tokenPrice[_tokenId];
        require(msg.value >= price, "Insufficient funds to purchase the token");
        address creator = tokenOwner[_tokenId];
        address seller = trackToken[_tokenId];
        uint256 totalAmount = msg.value;

        // Calculate royalty and transaction cut amounts
        uint256 royaltyAmount = (totalAmount * royaltyPercentage) / 100;
        uint256 cutAmount = (totalAmount * transactionCutPercentage) / 1000;

        // Calculate the amount to be paid to the seller
        uint256 sellerAmount = totalAmount - (royaltyAmount + cutAmount);

        require(sellerAmount > 0, "Seller amount should be greater than zero");

        // Transfer royalty to the creator
        require(
            royaltyAmount > 0,
            "Royalty amount should be greater than zero"
        );
        payable(creator).transfer(royaltyAmount);

        // Transfer funds to the seller
        require(sellerAmount > 0, "Seller amount should be greater than zero");
        payable(seller).transfer(sellerAmount);

        // Transfer ownership of the token
        _transfer(seller, msg.sender, _tokenId);

        trackToken[_tokenId] = msg.sender;
    }

    function getOwnedTokens(
        address _owner
    ) public view returns (uint256[] memory) {
        return ownedTokens[_owner];
    }

    function getUriOfToken(
        uint256 tokenId
    ) public view returns (string memory uri) {
        return tokenURI(tokenId);
    }
}

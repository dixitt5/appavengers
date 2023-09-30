import React, { useRef, useState } from "react";
import { db } from "@/config/firebase";
// Firebase storage imports
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid"; // UUID for generating unique IDs
import { storage } from "@/config/firebase";
// Firestore imports
import { doc, setDoc } from "firebase/firestore";
// Blockchain function to create NFT
import { createNFT } from "@/config/blockchain";
import { useAccount } from "wagmi"; // Hook to get account details
import { NFTStorage } from "nft.storage"; // IPFS storage for NFTs
import toast, { Toaster } from "react-hot-toast"; // Toast notifications
import { useRouter } from "next/router"; // Next.js router


// Function to convert uint256 to integer
function uint256ToInt(uint256Value) {
  // Maximum safe integer value in JavaScript (2^53 - 1)
  const maxSafeInt = Number.MAX_SAFE_INTEGER;

  // Convert the uint256 value to a BigInt to handle 256-bit integers
  const bigIntValue = BigInt(uint256Value);

  // Check if the value is greater than the maximum safe integer value
  if (bigIntValue > BigInt(maxSafeInt)) {
    // If it is, return the value as a BigInt
    return bigIntValue;
  } else {
    // If it's within the safe integer range, convert it to a regular int
    return Number(bigIntValue);
  }
}

const Create = () => {
   // References for form inputs
  const nameRef = useRef();
  const priceRef = useRef();
  const descriptionRef = useRef();
  const linkRef = useRef();
  const [imageUpload, setImageUpload] = useState(); // State for uploaded image
  const { address } = useAccount(); // Get user's blockchain address
  const router = useRouter(); // Next.js router instance

   // Function to upload the image to Firebase storage
  const uploadFile = async () => {
    const imageRef = ref(storage, `images/${v4()}`);
    await uploadBytes(imageRef, imageUpload);
    const downloadUrl = await getDownloadURL(imageRef);
    linkRef.current = downloadUrl;
  };

    // Function to list the NFT
  const listNFT = async (e) => {
    try {
      e.preventDefault();
      await uploadFile();
      const nft = {
        image: imageUpload,
        name: nameRef.current.value,
        description: descriptionRef.current.value,
        external_url: "Google.com",
        attributes: [
          {
            trait_type: "Category",
            value: "Collectibles",
          },
        ],
      };
      console.log(nft);
      console.log("Uploading Metadata to IPFS ....");
      const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_TOKEN,
      });
      const metadata = await client.store(nft);
      console.log(metadata.url);
      const uri = metadata.url;
      toast.success("Image Uploaded on IPFS Successfully!");
      const transaction = await createNFT(uri, priceRef.current.value, address);
      console.log(transaction);
      toast.success("NFT Minted Successfully!");
      const tokenId = uint256ToInt(transaction.logs[0].topics[3]);
      const tokenids = tokenId.toString();
      const formData = {
        name: nameRef.current.value,
        price: priceRef.current.value,
        description: descriptionRef.current.value,
        link: linkRef.current,
        id: tokenId,
        owner: address,
      };
      console.log(tokenids);
      console.log(formData);
      const NFTDocRef = doc(db, "nfts", tokenids);
      setDoc(NFTDocRef, formData);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Toaster />
        {/* NFT form */}
      <div className="flex flex-col place-items-center mt-5" id="nftForm">
        <form
          onSubmit={listNFT}
          className="bg-black shadow-pink-800 rounded px-8 pt-4 pb-8 mb-4"
        >
          <h3 className="text-center text-4xl font-bold text-white rounded-md p-2 mb-8">
            Upload NFT
          </h3>
          <div className="mb-4">
            <label
              className="block text-blue-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              NFT Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Flow"
              ref={nameRef}
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-blue-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              NFT Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="More description about NFT"
              ref={descriptionRef}
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              className="block text-blue-500 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price (in Matic)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Price of NFT"
              step="0.01"
              ref={priceRef}
            ></input>
          </div>
          <div>
            <label
              className="block text-blue-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload NFT Image
            </label>
            <input
              type={"file"}
              onChange={(event) => {
                setImageUpload(event.target.files[0]);
              }}
            ></input>
          </div>
          <br></br>
          <button
            type="submit"
            className="font-bold mt-1 w-full bg-green-500 text-white rounded p-2 shadow-lg"
          >
            List NFT
          </button>
          <div className="text-green text-blue-100 text-center">
            List your NFT here!
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;

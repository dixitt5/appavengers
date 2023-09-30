import Image from "next/image";
import { Inter } from "next/font/google";
import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  limit,
  updateDoc
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { buyToken } from "@/config/blockchain";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [fetchedTrue, setFetchedData] = useState(false);
  const { address } = useAccount();

  const buyNFT = async (tokenId) => {
    try {
      const tokenIds = tokenId.toString();
      const docRef = doc(db, "nfts", tokenIds);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      console.log(data.price);
      const transaction = await buyToken(tokenIds, address, data.price);
      console.log(transaction);
      const ref = doc(db, "nfts", tokenIds);
      await updateDoc(ref, {
        owner: address,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getNFTCollections = async () => {
      try {
        const nftsRef = collection(db, "nfts");
        const q = query(nftsRef, orderBy("id", "desc"), limit(48));
        // Fetch the first 50 NFTs
        const initialTokenData = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          initialTokenData.push({ id: doc.id, ...doc.data() });
        });
        console.log(initialTokenData);
        setTokens(initialTokenData);
        setFetchedData(true);
      } catch (error) {
        console.error("Error fetching NFT collections:", error);
      }
    };
    getNFTCollections();
  }, []);
  return (
    <main
      className={`flex bg-slate-950 min-h-max flex-col p-24 ${inter.className}`}
    >
      <div>
        <h1 className="text-4xl font-bold text-center mb-4">
          Browse Through NFTs
        </h1>
      </div>
      {fetchedTrue && (
        <div className="grid grid-cols-3 gap-3">
          {tokens.map((data) => {
            return (
              <div className="border-2 ml-12 mt-5 mb-12 flex flex-col h-auto justify-between items-center rounded-lg w-32 md:w-72 shadow-2xl">
                <Image
                  src={data.link}
                  alt="nft"
                  width={200}
                  height={200}
                  className="rounded-lg object-fill"
                />
                <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                  <strong className="text-xl">{data.name}</strong>
                  <p className="display-inline">{data.description}</p>
                </div>
                <div>
                  {address == data.owner ? (
                    <div className="text-black bg-white rounded p-2 my-2">
                      Owned
                    </div>
                  ) : (
                    <button
                      onClick={() => buyNFT(data.id)}
                      className="bg-blue-400 w-full rounded p-2 my-2"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

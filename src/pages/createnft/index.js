import React, { useRef, useState } from "react";
import { db } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "@/config/firebase";
import { addDoc, collection, setDoc } from "firebase/firestore";

const Create = () => {
  const nameRef = useRef();
  const priceRef = useRef();
  const descriptionRef = useRef();
  const linkRef = useRef();
  const [imageUpload, setImageUpload] = useState();
  const [Image, setImage] = useState();

  const uploadFile = async () => {
    const imageRef = ref(storage, `images/${v4()}`);
    await uploadBytes(imageRef, imageUpload);
    const downloadUrl = await getDownloadURL(imageRef);
    linkRef.current = downloadUrl;
  };

  const listNFT = async (e) => {
    e.preventDefault();
    await uploadFile();
    const formData = {
      name: nameRef.current.value,
      price: priceRef.current.value,
      descrtiption: descriptionRef.current.value,
      link: linkRef.current,
    };
    console.log(formData);
    const NFTDocRef = collection(db, "nfts");
    setDoc(NFTDocRef, formData);
    alert("done");
  };
  return (
    <div>
      <div className="flex flex-col place-items-center mt-5" id="nftForm">
        <form
          onSubmit={listNFT}
          className="bg-black shadow-pink-800 rounded px-8 pt-4 pb-8 mb-4"
        >
          <h3 className="text-center font-bold text-white bg-blue-400 rounded-md p-2 mb-8">
            Upload the NFT
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
                setImage(URL.createObjectURL(event.target.files[0]));
              }}
            ></input>
          </div>
          <br></br>
          <div className="text-green text-center">List you NFT here!</div>
          <button
            type="submit"
            className="font-bold mt-10 w-full bg-green-500 text-white rounded p-2 shadow-lg"
          >
            List NFT
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;

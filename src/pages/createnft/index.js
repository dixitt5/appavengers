import React from 'react'

const Create = () => {

  return (
    <div><div className="flex flex-col place-items-center mt-5" id="nftForm">
    <form className="bg-black shadow-pink-800 rounded px-8 pt-4 pb-8 mb-4">
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
          // onChange={(e) =>
          //   updateFormParams({ ...formParams, name: e.target.value })
          // }
          // value={formParams.name}
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
          // value={formParams.description}
          // onChange={(e) =>
          //   updateFormParams({ ...formParams, description: e.target.value })
          // }
        ></textarea>
      </div>
      <div className="mb-4">
        <label
          className="block text-blue-500 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Price
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="number"
          type="number"
          placeholder="Price"
          // onChange={(e) => {
          //   updateFormParams({ ...formParams, email: e.target.value });
          //   store.dispatch(updateEmail({ email: formParams.email }));
          // }}
          // value={formParams.email}
        ></input>
      </div>
      {/* <div className="mb-6">
        <label
          className="block text-pink-500	 text-sm font-bold mb-2"
          htmlFor="price"
        >
          Price (in ETH)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          placeholder="Min 0.01 ETH"
          step="0.01"
          value={formParams.price}
          onChange={(e) =>
            updateFormParams({ ...formParams, price: e.target.value })
          }
        ></input>
      </div> */}
      <div>
        <label
          className="block text-blue-500 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Upload NFT Image
        </label>
        <input type={"file"}></input>
      </div>
      <br></br>
      <div className="text-green text-center">heif</div>
      <button
        onClick={listNFT}
        className="font-bold mt-10 w-full bg-green-500 text-white rounded p-2 shadow-lg"
      >
        List NFT
      </button>
    </form>
  </div></div>
  )
}

export default Create
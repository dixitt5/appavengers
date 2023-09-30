import "@/styles/globals.css";
import { WagmiConfig, createConfig } from "wagmi";
import {
  ConnectKitProvider,
  getDefaultConfig,
} from "connectkit";
import Navbar from "@/components/Navbar";
import { polygonMumbai } from "viem/chains";


const chains = [polygonMumbai]
const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT,

    // Required
    appName: "AppAvengers",

    // Optional
    appDescription: "AppAvengers NFTs",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains,
  })
);

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={config} >
      <ConnectKitProvider>
      <Navbar/>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

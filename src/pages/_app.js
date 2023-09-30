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
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT,
    appName: "AppAvengers",
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

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {TestLightRelay} from "@bob-collective/bob/relay/TestLightRelay.sol";
import {BitcoinUsdc} from "../src/BitcoinUsdc.sol";

contract BitcoinUsdcScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdc = vm.envAddress("USDC_ADDRESS");
        vm.startBroadcast(deployerPrivateKey);

        TestLightRelay relay = new TestLightRelay();

        new BitcoinUsdc(relay, usdc);

        vm.stopBroadcast();
    }
}

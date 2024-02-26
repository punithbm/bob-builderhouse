// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {TestLightRelay} from "@bob-collective/bob/relay/TestLightRelay.sol";
import {BitcoinUsdt} from "../src/BitcoinUsdt.sol";

contract BitcoinUsdtScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdt = vm.envAddress("USDT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        TestLightRelay relay = new TestLightRelay();

        new BitcoinUsdt(relay, usdt);

        vm.stopBroadcast();
    }
}

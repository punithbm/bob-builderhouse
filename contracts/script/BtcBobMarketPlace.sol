// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {TestLightRelay} from "@bob-collective/bob/relay/TestLightRelay.sol";
import {BtcBobMarketPlace} from "../src/BtcBobMarketPlace.sol";

contract BtcBobMarketPlaceScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        TestLightRelay relay = new TestLightRelay();
        vm.startBroadcast(deployerPrivateKey);
        new BtcBobMarketPlace(relay);
        vm.stopBroadcast();
    }
}

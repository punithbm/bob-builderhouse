// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// Import OpenZeppelin ERC20, SafeERC20, and Ownable contracts
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Import external contracts
import {stdStorage, StdStorage, Test, console} from "forge-std/Test.sol";
import {Utilities} from "./Utilities.sol";
import {BitcoinTx} from "@bob-collective/bob/bridge/BitcoinTx.sol";
import {TestLightRelay} from "@bob-collective/bob/relay/TestLightRelay.sol";
import {BitcoinUsdc} from "../src/BitcoinUsdc.sol";

// Arbitary ERC20 token for testing purposes
contract ArbitaryUsdtToken is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

    // Function for the owner to mint tokens
    function sudoMint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

// Using SafeERC20 for IERC20 interface
using SafeERC20 for IERC20;

// Test contract for BitcoinUsdc functionality
contract BitcoinUsdcTest is BitcoinUsdc, Test {
    Utilities internal utils;
    address payable[] internal users;
    address internal alice;
    address internal bob;
    ArbitaryUsdtToken usdtToken = new ArbitaryUsdtToken("0xF58de5056b7057D74f957e75bFfe865F571c3fB6", "USDT");

    // Constructor initializes BitcoinUsdcTest with a TestLightRelay and ArbitaryUsdtToken
    constructor() BitcoinUsdc(testLightRelay, address(usdtToken)) {}

    // Function to set up test environment
    function setUp() public {
        utils = new Utilities();
        users = utils.createUsers(5);
        alice = users[0];
        vm.label(alice, "Alice");
        bob = users[1];
        vm.label(bob, "Bob");
        testLightRelay = new TestLightRelay();
        super.setRelay(testLightRelay);
    }

    // Function returning a dummy Bitcoin address for testing
    function dummyBitcoinAddress() public pure returns (BitcoinAddress memory) {
        return BitcoinAddress({scriptPubKey: hex"76a914fd7e6999cd7e7114383e014b7e612a88ab6be68f88ac"});
    }

    // Function returning a dummy ordinal Bitcoin address for testing
    function dummyOrdinalBitcoinAddress() public pure returns (BitcoinAddress memory) {
        return BitcoinAddress({scriptPubKey: hex"0014e257eccafbc07c381642ce6e7e55120fb077fbed"});
    }

    // Function testing the full flow of BTC sell order
    function test_btcSellOrderFullFlow() public {
        usdtToken.sudoMint(bob, 100);

        vm.startPrank(alice);
        vm.expectEmit();
        emit btcSellOrderSuccessfullyPlaced(0, 1000, 10);
        this.placeBtcSellOrder(1000, 10);

        vm.startPrank(bob);
        usdtToken.approve(address(this), 1000);
        vm.expectEmit();
        emit btcSellOrderBtcSellOrderAccepted(0, dummyBitcoinAddress());
        this.acceptBtcSellOrder(0, dummyBitcoinAddress());

        vm.startPrank(alice);
        vm.expectEmit();
        emit btcSuccessfullySendtoDestination(0);
        this.completeBtcSellOrder(0, utils.dummyTransaction(), utils.dummyProof());
    }

    // Function testing the full flow of ordinal sell order
    function test_ordinalSellOrderFullFlow() public {
        (BitcoinTx.Info memory info, BitcoinTx.Proof memory proof, BitcoinTx.UTXO memory utxo) =
            utils.dummyOrdinalInfo();
        OrdinalId memory id;

        usdtToken.sudoMint(bob, 100);

        // swapOrdinalToUsdt by alice
        vm.startPrank(alice);
        vm.expectEmit();
        emit ordinalSellOrderSuccessfullyPlaced(0, id, 100);
        this.placeOrdinalSellOrder(id, utxo, 100);

        // acceptOrdinalToUsdtSwap by bob
        vm.startPrank(bob);
        usdtToken.approve(address(this), 100);
        vm.expectEmit();
        emit ordinalSellOrderBtcSellOrderAccepted(0, dummyOrdinalBitcoinAddress());
        this.acceptOrdinalSellOrder(0, dummyOrdinalBitcoinAddress());

        vm.startPrank(alice);
        vm.expectEmit();
        emit ordinalSuccessfullySendtoDestination(0);
        this.completeOrdinalSellOrder(0, info, proof);
    }
}

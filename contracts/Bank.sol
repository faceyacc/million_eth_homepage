// SPDX-License-Identifier: MIT
pragma solidity >=0.4.11;

contract Bank {
    address public owner = msg.sender;
    mapping (address => uint) public balances;
    
    event DepositMade(
        address sentBy,
        uint amount
    );
    
    function deposit() payable public {
        balances[msg.sender] += msg.value;
        emit DepositMade(msg.sender, msg.value);
    }
    
    function withdraw() {
        var balance = balances[msg.sender];
        balances[msg.sender] = 0;
        msg.sender.transfer(balance);
    }
    
    function destroy() payable public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }
}
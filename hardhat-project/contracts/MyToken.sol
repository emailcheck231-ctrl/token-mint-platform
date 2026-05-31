// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev A standard ERC-20 token contract with additional features:
 * - Burnable: Token holders can burn their tokens
 * - Pausable: Owner can pause/unpause token transfers
 * - Ownable: Owner can manage token permissions
 *
 * This contract is built using OpenZeppelin's battle-tested contracts.
 */
contract MyToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    /**
     * @dev Constructor to initialize the token
     * @param initialSupply The initial number of tokens to mint (in the smallest unit)
     * @param tokenName The name of the token
     * @param tokenSymbol The symbol of the token
     *
     * Example: To create 1,000,000 tokens with 18 decimals:
     * initialSupply = 1000000000000000000000000 (1,000,000 * 10^18)
     */
    constructor(
        uint256 initialSupply,
        string memory tokenName,
        string memory tokenSymbol
    ) ERC20(tokenName, tokenSymbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Pause token transfers (only owner can call)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers (only owner can call)
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Mint new tokens (only owner can call)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Internal function to update balances when tokens are transferred
     * Overrides required by Solidity for ERC20 and ERC20Pausable
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) whenNotPaused {
        super._update(from, to, amount);
    }

    /**
     * @dev Returns the number of decimals used to get its user representation
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     */
    function decimals() public view override returns (uint8) {
        return 18;
    }
}

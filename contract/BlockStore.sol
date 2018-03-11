pragma solidity ^0.4.20;

contract BlockStore {
    
    //Owner of the BlockStore contract
    address owner;
    
    //available amount of donations that owner can withdraw
    uint256 private currentDonations;
    
    //total donated funds
    uint256 private totalAmountOfDonations;
    
    //possible states of the item for sale
    enum ItemState {Created, Locked, Inactive}
    
    //Struct of the items for sale
    struct ItemForSale {
        address seller;
        address buyer;
        string buyerInfo;
        string itemTitle;
        string itemDescription;
        string itemPicture;
        uint256 price;
        ItemState state;
        uint256 creationTime;
    }
    
    //items in the store
    ItemForSale[] private itemsForSale;
    
    //Contract constructor
    function BlockStore() public {
        owner = msg.sender;
    }
    
    //TODO find better solution not to loop everything
    function viewItemForSale(uint256 idx) public view returns(string, string, string, uint256, ItemState){
        ItemForSale memory item = itemsForSale[idx];
        return (item.itemTitle, item.itemDescription, item.itemPicture, item.price, item.state);
    }
    
    //Checks how many items we have
    function checkItemsForSaleLength () public view returns (uint256) {
        return itemsForSale.length;
    }
    
    //registers item for sale if conditions are met.
    //In order to try to make the seller not to cheat with the item that he sells
    //we are forcing him to make a deposit equals to the price that he ask for his item. 
    //The seller will have his deposit back when the buyer confirms that the goods are received.
    function registerItemForSale(string _itemTitle, string _itemDescription, string _itemPicture, uint256 _price) canRegisterItemForSale(_itemDescription, _price, msg.value) public payable {
        ItemForSale memory item;
        item.seller = msg.sender;
        item.buyer = 0x0;
        item.itemTitle = _itemTitle;
        item.itemDescription = _itemDescription;
        item.itemPicture = _itemPicture;
        item.price = _price;
        item.state = ItemState.Created;
        uint256 time = block.timestamp;
        item.creationTime = time;
        itemsForSale.push(item);
        
        emit registerItem(itemsForSale.length-1, _itemTitle, _itemDescription, _itemPicture, _price, time);
    }
    
    //Attemt to buy the goods at the given index
    //In order to try make the buyer not to cheat, the buyer is forced to make a deposit.
    //The deposit is equals to the price of the item.
    //The buyer will receive his deposit once he confirms that he has received the goods.
    function buyItem(uint256 _itemIdx, string _buyerInfo) canBuy(_itemIdx, msg.value) public payable {
        ItemForSale storage itemToBuy = itemsForSale[_itemIdx];
        itemToBuy.buyer = msg.sender;
        itemToBuy.buyerInfo = _buyerInfo;
        itemToBuy.state = ItemState.Locked;
        
        emit itemBought(_itemIdx, itemToBuy.itemDescription, block.timestamp);
    }
    
    //Buyer confirms that he has received the item so he and the seller can receive their deposits;
    function confirmItemReceived(uint256 _itemIdx) canConfirm(_itemIdx, msg.sender) public {
        ItemForSale storage itemReceived = itemsForSale[_itemIdx];
        //refunds buyer
        itemReceived.buyer.transfer(itemReceived.price);
        //refunds seller
        itemReceived.seller.transfer(itemReceived.price*2);
        itemReceived.state = ItemState.Inactive;
        
        emit confirmItem(_itemIdx, itemReceived.itemDescription, block.timestamp);
    }
    
    //Everyone can donate funds to the BlockStore
    function donate() public payable {
        currentDonations += msg.value;
        totalAmountOfDonations += msg.value;
        
        emit donationMade();
    }
    
    //Only owner can withdraw if there is donation made
    function withdrawDonations() isOwner canWithdrawDonations public {
        owner.transfer(currentDonations);
        currentDonations = 0;
    }
    
    //Lets the owner of the store check the current amout of donations
    function checkCurrentDonations() isOwner public view returns(uint256) {
        return currentDonations;
    }
    
    //Lets anyone check how much donations the store has received
    function checkTotalDonations() public view returns(uint256) {
        return totalAmountOfDonations;
    }
    
    //Checks balance
    function checkBalance() isOwner public view returns(uint256) {
        return this.balance;
    }
    
    //cancel sale, only seller of the item can cancel
    function cancelSale(uint256 _itemIdx) canCancel (_itemIdx, msg.sender) public {
        ItemForSale storage item = itemsForSale[_itemIdx];
        item.state = ItemState.Inactive;
        if (item.buyer != address(0)) {
            item.buyer.transfer(item.price*2);
        }
        item.seller.transfer(item.price);
        
        emit itemCanceled(_itemIdx, item.itemDescription, block.timestamp);
    } 
    
    //All modifiers go below
    
    //is the function caller the contract owner
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    
    //is there a donation to withdraw
    modifier canWithdrawDonations() {
        require(currentDonations > 0 && this.balance >= currentDonations);
        _;
    }
    
    //can item be registered
    modifier canRegisterItemForSale(string _itemDescription, uint256 _price, uint256 _msgValue) {
        bytes memory itemDesc = bytes(_itemDescription);
        require(itemDesc.length > 0);
        require(_price > 0);
        //checks seller deposit
        require(_msgValue == _price);
        _;
    }
    
    //can buy an item at index(idx)
    modifier canBuy(uint256 _idx, uint256 _msgValue) {
        ItemForSale memory item = itemsForSale[_idx];
        //checks buyer deposit
        require(_msgValue == 2*item.price);
        require(item.state == ItemState.Created);
        _;
    }
    
    //only the buyer of the item can cofirm that he has received the goods
    modifier canConfirm(uint256 _idx, address _msgSender) {
        ItemForSale memory item = itemsForSale[_idx];
        require(item.buyer == _msgSender);
        require(item.state == ItemState.Locked);
        _;
    }
    
    //only the seller can cancel sale
    modifier canCancel(uint256 _itemIdx, address _msgSender) {
        ItemForSale memory item = itemsForSale[_itemIdx];
        require(item.seller == _msgSender);
        require(item.state == ItemState.Created || item.state == ItemState.Locked);
        _;
    }
    
    //events goes below
    event registerItem(uint256 _idx, string _itemTitle, string _itemDescription, string _itemPicture, uint256 _price, uint256 _time);
    
    event itemBought(uint256 _idx, string _itemDescription, uint256 _time);
    
    event confirmItem(uint256 _itemIdx, string itemDescription, uint256 _time);
    
    event donationMade();
    
    event itemCanceled(uint256 _itemIdx, string itemDescription, uint256 _time);
}
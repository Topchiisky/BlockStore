'use strict';

var Shuffle = window.Shuffle;

var Demo = function (element) {
    this.element = element;

    this.shuffle = new Shuffle(element, {
        itemSelector: '.picture-item',
    });

    // Log events.
    this.addShuffleEventListeners();

    this._activeFilters = [];

    this.addFilterButtons();
    this.addSorting();
    this.addSearchFilter();
};

Demo.prototype.toggleMode = function () {
    if (this.mode === 'additive') {
        this.mode = 'exclusive';
    } else {
        this.mode = 'additive';
    }
};

/**
 * Shuffle uses the CustomEvent constructor to dispatch events. You can listen
 * for them like you normally would (with jQuery for example).
 */
Demo.prototype.addShuffleEventListeners = function () {
    this.shuffle.on(Shuffle.EventType.LAYOUT, function (data) {
        console.log('layout. data:', data);
    });

    this.shuffle.on(Shuffle.EventType.REMOVED, function (data) {
        console.log('removed. data:', data);
    });
};

Demo.prototype.addFilterButtons = function () {
    var options = document.querySelector('.filter-options');

    if (!options) {
        return;
    }

    var filterButtons = Array.from(options.children);

    filterButtons.forEach(function (button) {
        button.addEventListener('click', this._handleFilterClick.bind(this), false);
    }, this);
};

Demo.prototype._handleFilterClick = function (evt) {
    var btn = evt.currentTarget;
    var isActive = btn.classList.contains('active');
    var btnGroup = btn.getAttribute('data-group');

    this._removeActiveClassFromChildren(btn.parentNode, btn);

    var filterGroup;
    if (isActive) {
        //btn.classList.remove('active');
        //btn.setAttribute("aria-pressed", false);
        filterGroup = Shuffle.ALL_ITEMS;
    } else {
        //btn.classList.add('active');
        //btn.setAttribute("aria-pressed", true);
        filterGroup = btnGroup;
    }

    this.shuffle.filter(filterGroup);
};

Demo.prototype._removeActiveClassFromChildren = function (parent, excludeBtn) {
    var children = parent.children;
    for (var i = children.length - 1; i >= 0; i--) {
        if (children[i] == excludeBtn) {
            continue;
        }
        children[i].classList.remove('active');
        children[i].setAttribute("aria-pressed", false);
    }
};

Demo.prototype.addSorting = function () {
    var buttonGroup = document.querySelector('.sort-options');

    if (!buttonGroup) {
        return;
    }

    buttonGroup.addEventListener('change', this._handleSortChange.bind(this));
};

Demo.prototype._handleSortChange = function (evt) {
    // Add and remove `active` class from buttons.
    var wrapper = evt.currentTarget;
    var buttons = Array.from(evt.currentTarget.children);
    buttons.forEach(function (button) {
        if (button.querySelector('input').value === evt.target.value) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    // Create the sort options to give to Shuffle.
    var value = evt.target.value;
    var options = {};

    function sortByDate(element) {
        return element.getAttribute('data-created');
    }

    function sortByTitle(element) {
        return element.getAttribute('data-title').toLowerCase();
    }

    if (value === 'date-created') {
        options = {
            reverse: true,
            by: sortByDate,
        };
    } else if (value === 'title') {
        options = {
            by: sortByTitle,
        };
    }

    this.shuffle.sort(options);
};

// Advanced filtering
Demo.prototype.addSearchFilter = function () {
    var searchInput = document.querySelector('.js-shuffle-search');

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener('keyup', this._handleSearchKeyup.bind(this));
};

/**
 * Filter the shuffle instance by items with a title that matches the search input.
 * @param {Event} evt Event object.
 */
Demo.prototype._handleSearchKeyup = function (evt) {
    var searchText = evt.target.value.toLowerCase();

    this.shuffle.filter(function (element, shuffle) {

        // If there is a current filter applied, ignore elements that don't match it.
        if (shuffle.group !== Shuffle.ALL_ITEMS) {
            // Get the item's groups.
            var groups = JSON.parse(element.getAttribute('data-groups'));
            var isElementInCurrentGroup = groups.indexOf(shuffle.group) !== -1;

            // Only search elements in the current group
            if (!isElementInCurrentGroup) {
                return false;
            }
        }

        var titleElement = element.querySelector('.picture-item__title');
        var titleText = titleElement.textContent.toLowerCase().trim();

        return titleText.indexOf(searchText) !== -1;
    });
};

var MyWeb3 = function () {
    if (!this.checkForWeb3()) {
        return;
    }

    this.setUpDefaultAccount();
    this.createContract();
    this.getTotalDonations();
    this.registerDonationEvent();
    this.registerItemForSaleEvent();
    this.registerItemBought();
    this.registerConfirmedItemEvent();
    this.registerCancelItemEvent();
    console.log('we have web3 provider GO GO GO');
};

MyWeb3.prototype.checkForWeb3 = function () {
    try {
        if (typeof window.web3 !== 'undefined') {
            window.web3 = new Web3(web3.currentProvider);
        } else {
            window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }
    } catch (err) {
        this.showNoWeb3Error();
        return false;
    }

    window.web3.version.getNetwork((err, netId) => {
        switch (netId) {
            case "1":
                console.log('This is mainnet');
                MyWeb3.networkAddress = "https://etherscan.io/tx/";
                break
            case "2":
                console.log('This is the deprecated Morden test network.');
                break
            case "3":
                console.log('This is the ropsten test network.');
                MyWeb3.networkAddress = "https://ropsten.etherscan.io/tx/";
                break
            default:
                MyWeb3.networkAddress = "https://ropsten.etherscan.io/tx/";
        }
    });

    return true;
};

MyWeb3.prototype.showNoWeb3Error = function () {
    alert("please Install metamask to use this app");
};

MyWeb3.prototype.setUpDefaultAccount = function () {
    window.web3.eth.defaultAccount = window.web3.eth.accounts[0];
};

MyWeb3.prototype.createContract = function () {
    MyWeb3.contractABI = window.web3.eth.contract(ContractABI);
    MyWeb3.contract = MyWeb3.contractABI.at(ContractAddress);
};

MyWeb3.prototype.getTotalDonations = function () {
    MyWeb3.contract.checkTotalDonations((err, res) => {
        if (!err) {
            var valToSet = $('#donationRaised').text();
            valToSet = valToSet.split(":")[0] + ": " + window.web3.fromWei(res.toString(), 'ether') + " ETH";
            $('#donationRaised').text(valToSet);
        }
    });
};

MyWeb3.prototype.makeDonation = function () {
    var modalDonationForm = $('#modalDonationForm');
    var donationInput = $('#modalDonationInput');
    var donation = donationInput.val();
    if (!$.isNumeric(donation)) {
        return;
    }
    MyWeb3.contract.donate({ from: window.web3.eth.defaultAccount, gas: 3000000, value: window.web3.toWei(donation, 'ether') }, (err, res) => {
        if (!err) {
            console.log('making donation ' + res);
            window.customHandlers.pendingTransactions(res, 'add', 'Donation:');
        }
    });

    modalDonationForm.find('.close').click()
};

MyWeb3.prototype.registerDonationEvent = function () {
    MyWeb3.donationEvent = MyWeb3.contract.donationMade({}, 'latest');
    MyWeb3.donationEvent.watch(function (err, result) {
        if (!err) {
            window.myWeb3.getTotalDonations();
            console.log('Donation made: ' + JSON.stringify(result));
            window.customHandlers.pendingTransactions(result.transactionHash, 'remove');
        }
    });
};

MyWeb3.prototype.registerItemForSale = function (itemTitle, itemDescription, itemTag, itemPicture, price) {
    MyWeb3.contract.registerItemForSale(itemTitle, itemDescription, itemTag, itemPicture, window.web3.toWei(price, 'ether'), {
        from: window.web3.eth.defaultAccount,
        gas: 3000000,
        value: window.web3.toWei(price, 'ether')
    }, (err, res) => {
        if (!err) {
            console.log('sending for sale ' + res);
            window.customHandlers.pendingTransactions(res, 'add', 'Selling ' + itemTitle + ':');
        } else {
            alert("Oups... something went wrong!");
        }
    });
};

MyWeb3.prototype.buyItem = function (idx, buyerInfo, price, itemTitle) {
    MyWeb3.contract.buyItem(idx, buyerInfo, {
        from: window.web3.eth.defaultAccount,
        gas: 3000000,
        value: window.web3.toWei(price * 2, 'ether')
    }, (err, res) => {
        if (!err) {
            console.log('buying Item ' + res);
            window.customHandlers.pendingTransactions(res, 'add', 'Buying ' + itemTitle + ':');
        } else {
            alert("Oups... something went wrong!");
        }
    });
};

MyWeb3.prototype.confirmItem = function (idx, itemTitle) {
    MyWeb3.contract.confirmItemReceived(idx, {
        from: window.web3.eth.defaultAccount,
        gas: 3000000
    }, (err, res) => {
        if (!err) {
            console.log('confirming Item ' + res);
            window.customHandlers.pendingTransactions(res, 'add', 'Confirming ' + itemTitle + ':');
        } else {
            alert("Oups... something went wrong!");
        }
    });
};

MyWeb3.prototype.cancelItem = function (idx, itemTitle) {
    MyWeb3.contract.cancelSale(idx, {
        from: window.web3.eth.defaultAccount,
        gas: 3000000
    }, (err, res) => {
        if (!err) {
            console.log('canceling Item ' + res);
            window.customHandlers.pendingTransactions(res, 'add', 'Canceling ' + itemTitle + ':');
        } else {
            alert("Oups... something went wrong!");
        }
    });
};

MyWeb3.prototype.registerCancelItemEvent = function () {
    MyWeb3.itemCanceledEvent = MyWeb3.contract.itemCanceled({}, 'latest');
    MyWeb3.itemCanceledEvent.watch(function (err, result) {
        if (!err) {
            console.log(result);
            var idx = result.args._itemIdx.toString();
            removeCard(idx);
            window.customHandlers.pendingTransactions(result.transactionHash, 'remove');
        }
    });
};

MyWeb3.prototype.registerConfirmedItemEvent = function () {
    MyWeb3.itemBoughtEvent = MyWeb3.contract.confirmItem({}, 'latest');
    MyWeb3.itemBoughtEvent.watch(function (err, result) {
        if (!err) {
            console.log(result);
            var idx = result.args._itemIdx.toString();
            removeCard(idx);
            window.customHandlers.pendingTransactions(result.transactionHash, 'remove');
        }
    });
};

MyWeb3.prototype.registerItemForSaleEvent = function () {
    MyWeb3.itemForSaleEvent = MyWeb3.contract.registerItem({}, 'latest');
    MyWeb3.itemForSaleEvent.watch(function (err, result) {
        if (!err) {
            console.log(result);
            var idx = result.args._idx.toString();
            var itemTitle = result.args._itemTitle;
            var itemDescription = result.args._itemDescription;
            var itemTag = result.args._itemTag;
            var itemPicture = result.args._itemPicture;
            var price = window.web3.fromWei(result.args._price.toString(), 'ether');
            var seller = result.args._seller;
            var time = result.args._time.toString();
            createItem(idx, itemTitle, itemDescription, itemTag, itemPicture, price, '0', seller, null, null,time);
            window.customHandlers.pendingTransactions(result.transactionHash, 'remove');
        }
    });
};

MyWeb3.prototype.registerItemBought = function () {
    MyWeb3.itemBoughtEvent = MyWeb3.contract.itemBought({}, 'latest');
    MyWeb3.itemBoughtEvent.watch(function (err, result) {
        if (!err) {
            console.log(result);
            var idx = result.args._idx.toString();
            var buyer = result.args._buyer;
            var buyerInfo = result.args._buyerInfo;
            updateCardBought(idx, buyer, buyerInfo);
            window.customHandlers.pendingTransactions(result.transactionHash, 'remove');
        }
    });
};

var CustomHandlers = function () {
};

CustomHandlers.prototype.addNumericValidation = function (el) {
    el.on('keyup', function () {
        if ($.isNumeric(el.val())) {
            el.removeClass('invalid').addClass('valid');
        } else {
            el.removeClass('valid').addClass('invalid');
        }

        if (el.val().length == 0) {
            el.removeClass('valid').removeClass('invalid');
        }
    });
};

CustomHandlers.prototype.addMakeDonation = function (el) {
    el.on('click', function () {
        window.myWeb3.makeDonation();
    });
};

CustomHandlers.prototype.pendingTransactions = function (transactionHash, state, msg) {
    var modalPending = $('#modalPending');
    var pendingTransactions = $('#pendingTransactions');

    if (state == 'add') {
        var p = $("<p>");
        var a = $("<a>");
        p.attr("id", transactionHash);
        a.attr("href", MyWeb3.networkAddress + transactionHash);
        a.attr("target", "_blank");

        var textToAdd = ((typeof msg !== undefined) && (msg != '')) ? msg + " " + transactionHash : transactionHash;

        a.text(textToAdd);

        p.append(a);

        pendingTransactions.append(p);
        if ($.inArray('show', modalPending.attr('class').split(' ')) < 0) {
            modalPending.modal('toggle');
        }
    }

    if (state == 'remove') {
        $("#" + transactionHash).remove();
        if (pendingTransactions.children().length == 0 && $.inArray('show', modalPending.attr('class').split(' ')) >= 0) {
            $('#modalPending').modal('toggle');
        }
    }
};

CustomHandlers.prototype.browseButton = function (button, input, textField) {
    button.on('click', function () {
        input.click();
    });
    input.on('change', function () {
        if ($('#imageInput')[0].files[0] === undefined) {
            return;
        }
        if (input[0].files[0].type.indexOf('image') < 0) {
            alert("Wrong file format! Please select an image!");
            return;
        }
        textField.val(input[0].files[0].name);
    });
};

CustomHandlers.prototype.clearModal = function (closeBtn, modal) {
    closeBtn.on('click', function () {
        modal.find("input[type=text], textarea, file").val("").trigger('keyup').trigger('focusout');
    });
};

CustomHandlers.prototype.sendForSale = function () {
    $('#sendForSale').on('click', function () {
        if ($('#imageInput')[0].files[0].type.indexOf('image') < 0) {
            alert("Wrong file format! Please select an image!");
            return;
        }

        if ($('#modalAddForSaleTitleInput').val() == '') {
            alert("Please provide a title");
            return;
        }
        var itemTitle = $('#modalAddForSaleTitleInput').val();

        if ($('#modalAddForSaleDescriptionInput').val() == '') {
            alert("Please provide a description");
            return;
        }
        var itemDescription = $('#modalAddForSaleDescriptionInput').val();

        if ($('#modalAddForSaleTag').val() == '') {
            alert("Please provide a tag");
            return;
        }
        var itemTag = $('#modalAddForSaleTag').val();

        if (!$.isNumeric($('#modalAddForSalePriceInput').val())) {
            alert("Please provide a price");
            return;
        }

        var price = $('#modalAddForSalePriceInput').val();

        var callback = function (imageHash) {
            window.myWeb3.registerItemForSale(itemTitle, itemDescription, itemTag, imageHash, price);
        };

        window.myIPFS.uploadImage($('#imageInput')[0].files[0], callback);

        $('#closeForSale').click();
    });
};

var MyIPFS = function () {
    this.ipfs = window.IpfsApi(IPFS_SETTINGS.host, IPFS_SETTINGS.port);
};

MyIPFS.prototype.getIpfs = function () {
    return this.ipfs;
};

MyIPFS.prototype.uploadImage = function (imageFile, callback) {
    var _ipfs = this.getIpfs();
    var reader = new FileReader();
    reader.onloadend = function () {
        var buf = _ipfs.Buffer(reader.result);
        _ipfs.add(buf, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            callback(result[0].hash);
            var url = `https://ipfs.io/ipfs/${result[0].hash}`;
            console.log(`Url --> ${url}`);
        });
    };
    reader.readAsArrayBuffer(imageFile);
};

function createItem(idx, itemTitle, itemDescription, itemTag, itemPicture, price, state, seller, buyer, buyerAddress, time) {
    if ($('#grid').find('#' + idx).length > 0) {
        return;
    }
    if (parseInt(state)>1) {
        return;
    }
    var date = new Date(parseInt(time) * 1000);
    var dateString = date.getUTCFullYear().toString() + '-' + date.getUTCMonth().toString() + '-' + date.getUTCDate().toString();
    var ipfsImage = 'https://ipfs.io/ipfs/' + itemPicture;
    var buyerInfo = (buyer != null) ? 'data-buyerInfo=' + buyer : '';
    var buyerAddress = (buyerAddress != null) ? 'data-buyerAddress=' + buyerAddress : '';
    var htmlStr = '<figure id="' + idx + '" class="col-lg-4 col-md-6 mb-4 picture-item" data-groups=\'["' + itemTag + '"]\' data-date-created="' + dateString + '" data-title="' + itemTitle + '" data-seller=' + seller + ' data-itemState=' + state + ' ' + buyerInfo + ' ' + buyerAddress + ' >' +
        '<!--Card-->' +
        '<div class="card">' +
        '<!--Card image-->' +
        '<div class="view overlay">' +
        '<img src="' + ipfsImage + '" class="img-fluid" alt="">' +
        '<a href="#">' +
        '<div class="mask rgba-white-slight"></div>' +
        '</a>' +
        '</div>' +
        '<!--Card content-->' +
        '<div class="card-body text-center">' +
        '<!--Title-->' +
        '<h4 class="card-title picture-item__title">' + itemTitle + '</h4>' +
        '<!--Text-->' +
        '<p class="card-text item-description">' + itemDescription + '</p>' +
        '<p class="card-text item-price">Price: ' + price + ' ETH</p>' +
        '<a class="btn btn-primary" onclick="onClickMore(' + idx + ')">More</a>' +
        '</div>' +
        '</div>' +
        '<!--/.Card-->' +
        '</figure>';
    var newItem = $(htmlStr);
    $(window.demo.shuffle.element).append(newItem);
    window.demo.shuffle.add(newItem);
    window.demo.shuffle.update();

    if ($('.filter-options').find('#' + itemTag) > 0) {
        return;
    }

    $('.filter-options').append('<button id="' + itemTag + '" type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off" data-group="' + itemTag + '">' + itemTag + '</button>');
    window.demo.addFilterButtons();
};

function loadCardsFromContract() {
    MyWeb3.contract.checkItemsForSaleLength((err, res) => {

        var buyerInfoCallBack = function(idx, itemTitle, itemDescription, itemTag, itemPicture, price, state, seller, buyer, buyerAddress) {
            MyWeb3.contract.getBuyerDetails(idx, (err, ress) => {
                if (!err) {
                    var buyer = ress[0];
                    var buyerAddress = ress[1];
                    var time = ress[2];
                    createItem(idx, itemTitle, itemDescription, itemTag, itemPicture, price, state, seller, buyer, buyerAddress, time);
                } else {
                    alert("Oups... something went wrong!");
                }
            });
        };
        if (!err) {
            console.log('items length ' + res);
            var length = parseInt(res.toString());
            for (var i = 0; i < length; i++) {
                var idx = i;
                MyWeb3.contract.viewItemForSale(idx, (err, ress) => {
                    if (!err) {
                        console.log(ress);
                        var itemTitle = ress[0];
                        var itemDescription = ress[1];
                        var itemTag = ress[2];
                        var itemPicture = ress[3];
                        var price = window.web3.fromWei(ress[4].toString(), 'ether');
                        var state = ress[5];
                        var seller = ress[6];
                        var id = ress[7].toString();
                        buyerInfoCallBack(id, itemTitle, itemDescription, itemTag, itemPicture, price, state, seller);
                    }
                    else {
                        alert("Oups... something went wrong!");
                    }
                });
            }
        } else {
            alert("Oups... something went wrong!");
        }
    });
};

function onClickMore(itemIdx) {
    var modal = $('#modalViewItemForm');
    var account = window.web3.eth.defaultAccount;
    var card = $('#' + itemIdx);
    var state = card.attr('data-itemState');
    var image = $('#' + itemIdx).find('img').attr('src');
    var modalPreviewImage = $('#modalPreviewImage');
    modalPreviewImage.attr('src', image);
    $('#modalViewItemTitle').text('Title: ' + card.attr('data-title'));
    $('#modalViewItemDescription').text('Description: ' + card.find('.item-description').text());
    $('#modalViewItemPrice').text(card.find('.item-price').text() + ' (ETH)');


    $('#confirmBtn').show();
    $('#cancelBtn').show();
    $('#buyBtn').show();

    if (state == '0') {
        $('#modalBuyerInputPreview').hide();
        $('#confirmBtn').hide();
    }

    if (state == '1') {
        $('#buyBtn').hide();
        $('#modalBuyerInputWrapper').hide();
        $('#modalBuyerInputPreview').text('Buyer info: ' + card.attr('data-buyerInfo'));
        $('#modalBuyerInputPreview').show();
        if (account == card.attr('data-seller')) {
            $('#confirmBtn').hide();
        }
    }

    if (account != card.attr('data-seller')) {
        $('#cancelBtn').hide();
    }

    $('#buyBtn').on('click', function () {
        buyItem(itemIdx, card.find('.item-price').text().split(" ")[1], card.attr('data-title'));
    });

    $('#confirmBtn').on('click', function () {
        confirmItem(itemIdx, card.attr('data-title'));
    });

    $('#cancelBtn').on('click', function () {
        cancelItem(itemIdx, card.attr('data-title'));
    });

    modal.modal('toggle');
};

function updateCardBought(idx, buyer, buyerInfo) {
    var card = $('#' + idx);
    card.attr('data-itemState', 1);
    card.attr('data-buyerInfo', buyerInfo);
    card.attr('data-buyerAddress', buyer);
};

function removeCard(idx) {
    var card = $('#' + idx);
    window.demo.shuffle.remove(card);
    card.remove();
};

function buyItem(idx, price, title) {
    var buyerInfo = $('#modalBuyerInput').val();
    if (buyerInfo == '') {
        alert('Enter buyer information!');
        return;
    }
    window.myWeb3.buyItem(idx, buyerInfo, price, title);
    $('#modalViewItemForm').modal('toggle');
};

function confirmItem(idx, itemTitle) {
    window.myWeb3.confirmItem(idx, itemTitle);
    $('#modalViewItemForm').modal('toggle');
}

function cancelItem(idx, itemTitle) {
    window.myWeb3.cancelItem(idx, itemTitle);
    $('#modalViewItemForm').modal('toggle');
};

document.addEventListener('DOMContentLoaded', function () {
    window.demo = new Demo(document.getElementById('grid'));
    window.myWeb3 = new MyWeb3();
    window.myIPFS = new MyIPFS();
    loadCardsFromContract();
    window.customHandlers = new CustomHandlers();
    window.customHandlers.addNumericValidation($('#modalDonationInput'));
    window.customHandlers.addNumericValidation($('#modalAddForSalePriceInput'));
    window.customHandlers.addMakeDonation($('#sendDonation'));
    window.customHandlers.sendForSale();
    window.customHandlers.clearModal($('#closeForSale'), $('#modalAddForSaleForm'));
    window.customHandlers.browseButton($('#browseBtn'), $('#imageInput'), $('#modalAddForSalePriceImage'));
});
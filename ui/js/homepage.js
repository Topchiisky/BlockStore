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

MyWeb3.prototype.registerItemForSale = function (itemTitle, itemDescription, itemPicture, price) {
    MyWeb3.contract.registerItemForSale(itemTitle, itemDescription, itemPicture, window.web3.toWei(price, 'ether'),{
        from: window.web3.eth.defaultAccount, 
        gas: 3000000, 
        value: window.web3.toWei(price, 'ether')
    }, (err, res) => {
        if (!err) {
            console.log('sending for sale ' + res);
            window.customHandlers.pendingTransactions(res, 'add', itemTitle);
        } else {
            alert("Oups... something went wrong!");
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

CustomHandlers.prototype.browseButton = function(button, input, textField) {
    button.on('click', function() {
        input.click();
    });
    input.on('change', function(){
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

CustomHandlers.prototype.clearModal = function(closeBtn, modal) {
    closeBtn.on('click', function() {
        modal.find("input[type=text], textarea, file").val("").trigger('keyup').trigger('focusout');
    });
};

CustomHandlers.prototype.sendForSale = function(){
    $('#sendForSale').on('click', function(){
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

        if (!$.isNumeric($('#modalAddForSalePriceInput').val())) {
            alert("Please provide a price");
            return;
        }
        var price = $('#modalAddForSalePriceInput').val();

        var callback = function(imageHash){
            window.myWeb3.registerItemForSale(itemTitle, itemDescription, imageHash, price);
        };

        window.myIPFS.uploadImage($('#imageInput')[0].files[0], callback);

        $('#closeForSale').click();
    });
};

var MyIPFS = function(){
    this.ipfs = window.IpfsApi(IPFS_SETTINGS.host, IPFS_SETTINGS.port);
};

MyIPFS.prototype.getIpfs = function () {
    return this.ipfs;
};

MyIPFS.prototype.uploadImage = function(imageFile, callback) {
    var _ipfs = this.getIpfs();
    var reader = new FileReader();
    reader.onloadend = function() {
        var buf = _ipfs.Buffer(reader.result);
        _ipfs.add(buf, (err, result) => {
            if(err) {
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

document.addEventListener('DOMContentLoaded', function () {
    window.demo = new Demo(document.getElementById('grid'));
    window.myWeb3 = new MyWeb3();
    window.myIPFS = new MyIPFS();
    window.customHandlers = new CustomHandlers();
    window.customHandlers.addNumericValidation($('#modalDonationInput'));
    window.customHandlers.addNumericValidation($('#modalAddForSalePriceInput'));
    window.customHandlers.addMakeDonation($('#sendDonation'));
    window.customHandlers.sendForSale();
    window.customHandlers.clearModal($('#closeForSale'), $('#modalAddForSaleForm'));
    window.customHandlers.browseButton($('#browseBtn'), $('#imageInput'), $('#modalAddForSalePriceImage'));
});
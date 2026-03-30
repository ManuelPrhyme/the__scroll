//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract OurOwn {

    event Tracked(address owner, bool status, uint16 value);

    function tracker() public {
        emit Tracked(address(uint160(uint256(keccak256(abi.encode(3456))))), true, 345);
    }

    function name() public pure returns(string memory){
        return "Emmanuel Bagoole";
    }

    function dob() public pure returns(uint256){
        return 1997;
    }
}


contract TheScroll {

    address private immutable owner;

    uint256 public constant PLATFORM_FEE_PERCENT = 3;

    uint256 public articleCounter;

    uint256 public platformBalance;

    struct Article {
        uint256 id;
        address author;
        address paymentAddress;
        uint256 price;
        uint256 subscriberCount;
    }

    mapping(uint256 => Article) public articles;

    mapping(uint256 => mapping(address => bool)) public subscribers;

    mapping(address => uint256[]) public authoredArticles;

    mapping(address => uint256[]) public subscribedArticles;

    event ArticleCreated(
        uint256 indexed articleId,
        address indexed author,
        uint256 price
    );

    event ArticlePurchased(
        uint256 indexed articleId,
        address indexed buyer,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createArticle(
        uint256 price,
        address paymentAddress
    ) external {

        require(paymentAddress != address(0), "Invalid payment address");

        articleCounter++;

        Article memory newArticle = Article({
            id: articleCounter,
            author: msg.sender,
            paymentAddress: paymentAddress,
            price: price,
            subscriberCount: 0
        });

        articles[articleCounter] = newArticle;
        authoredArticles[msg.sender].push(articleCounter);
        emit ArticleCreated(articleCounter, msg.sender, price);
    }

    function purchaseArticle(uint256 articleId) external payable {

        Article storage article = articles[articleId];
        require(article.id != 0, "Article does not exist");
        require(!subscribers[articleId][msg.sender], "Already purchased");
        require(msg.value == article.price, "Incorrect payment");

        uint256 fee = (msg.value * PLATFORM_FEE_PERCENT) / 100;
        uint256 authorAmount = msg.value - fee;

        platformBalance += fee;
        subscribers[articleId][msg.sender] = true;
        article.subscriberCount++;
        subscribedArticles[msg.sender].push(articleId);

        (bool success, ) = payable(article.paymentAddress).call{value: authorAmount}("");
        require(success, "Author payment failed");

        emit ArticlePurchased(articleId, msg.sender, msg.value);
    }

    function hasAccess(uint256 articleId, address user) public view returns (bool) {

        Article storage article = articles[articleId];

        if (user == article.author) {
            return true;
        }

        return subscribers[articleId][user];
    }

    function getAuthorArticles(address author)
        external
        view
        returns (uint256[] memory)
    {
        return authoredArticles[author];
    }

    function getSubscribedArticles(address user)
        external
        view
        returns (uint256[] memory)
    {
        return subscribedArticles[user];
    }

    function withdrawPlatformFees() external onlyOwner {

        uint256 amount = platformBalance;
        require(amount > 0, "No funds");
        platformBalance = 0;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdraw failed");
    }

    function getArticle(uint256 articleId)
        external
        view
        returns (Article memory)
    {
        return articles[articleId];
    }

}
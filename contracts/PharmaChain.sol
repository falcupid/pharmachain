// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract PharmaChain {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    uint256 product_id = 0;
    uint256 worker_id = 0;

    struct Product {
        uint256 id;
        string name;
        string batchNumber;
        string manufacturer;
        string description;
        string requiredTemperature;
        string manufacturingDate;
        string expiryDate;
        address currentOwner;
        uint256 timestamp;
        bool verified;
    }

    struct Status {
        string location;
        uint256 timestamp;
        string temp;
        string humidity;
        string heatindex;
        uint256 w_id;
        uint256 p_id;
        uint256 total_quantity;
        bool flag;
    }

    struct Worker {
        string name;
        uint256 id;
        uint256 timestamp;
    }

    struct Data {
        uint256 temp;
        uint256 humidity;
        uint256 hindex;
        uint256 pid;
    }

    event ProductRegistered(
        uint256 productId,
        string name,
        address owner
    );

    event OwnershipTransferred(
        uint256 productId,
        address previousOwner,
        address newOwner
    );

    Product[] public products_list;
    Status[] public productStatus;
    Worker[] public workers_list;
    Data[] public Data_list;

    mapping(uint256 => Status[]) public product_Status;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Worker) public workers;
    mapping(uint256 => Data[]) public data;

    function setWorker(string memory name) public payable {
        require(msg.sender == owner, "Only owner can add workers");
        Worker memory workerInfo = Worker(name, worker_id, block.timestamp);
        workers[worker_id] = workerInfo;
        workers_list.push(workerInfo);
        worker_id++;
    }

    function addProduct(
        string memory name,
        string memory batchNumber,
        string memory manufacturer,
        string memory description,
        string memory requiredTemperature,
        string memory manufacturingDate,
        string memory expiryDate
    ) public payable {

        require(msg.sender == owner, "Only owner can register products");

        Product memory productInfo = Product(
            product_id,
            name,
            batchNumber,
            manufacturer,
            description,
            requiredTemperature,
            manufacturingDate,
            expiryDate,
            msg.sender,
            block.timestamp,
            true
        );

        products[product_id] = productInfo;
        products_list.push(productInfo);

        emit ProductRegistered(
            product_id,
            name,
            msg.sender
        );

        product_id++;
    }

    function addStatus(
        string memory location,
        string memory temp,
        string memory humidity,
        string memory heatindex,
        uint256 wid,
        uint256 pid,
        uint256 total_quantity,
        bool flag
    ) public payable {
        Status memory statusInfo = Status(
            location,
            block.timestamp,
            temp,
            humidity,
            heatindex,
            wid,
            pid,
            total_quantity,
            flag
        );
        product_Status[pid].push(statusInfo);
        productStatus.push(statusInfo);
    }

    function addData(
        uint256 temp,
        uint256 humidity,
        uint256 hindex,
        uint256 pid
    ) public payable {
        Data memory dataInfo = Data(temp, humidity, hindex, pid);
        data[pid].push(dataInfo);
        Data_list.push(dataInfo);
    }

    function getWorkersList() public view returns (Worker[] memory) {
        return workers_list;
    }

    function getProductStatus(uint256 id) public view returns (Status[] memory) {
        return product_Status[id];
    }

    function getProductData(uint256 id) public view returns (Data[] memory) {
        return data[id];
    }

    function getProducts() public view returns (Product[] memory) {
        return products_list;
    }

    function getProduct(uint256 id) public view returns (Product memory) {
        return products[id];
    }

    function verifyProduct(uint256 id) public view returns (bool) {
        return products[id].verified;
    }

    function transferOwnership(
        uint256 productId,
        address newOwner
    ) public {

        require(products[productId].verified, "Product not found");

        require(
            msg.sender == products[productId].currentOwner,
            "Only current owner can transfer ownership"
        );

        address previousOwner = products[productId].currentOwner;

        products[productId].currentOwner = newOwner;

        emit OwnershipTransferred(
            productId,
            previousOwner,
            newOwner
        );
    }

    function getCurrentOwner(uint256 productId)
        public
        view
        returns(address)
    {
        return products[productId].currentOwner;
    }

}

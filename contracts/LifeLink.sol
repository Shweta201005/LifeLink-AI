// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

contract LifeLink {

    address public owner;

    enum Role {
        None,
        Hospital,
        BloodBank
    }

    enum RequestStatus {
        None,
        Open,
        Reserved,
        Dispatched,
        Received
    }

    struct BloodRequest {
        uint256 requestId;
        address hospital;
        address bloodBank;
        bytes32 bloodGroup;
        uint256 units;
        RequestStatus status;
    }

    mapping(address => Role) public roles;

    mapping(address => mapping(bytes32 => uint256))
        public inventory;

    mapping(uint256 => BloodRequest)
        public requests;

    uint256 public nextRequestId = 1;

    event HospitalRegistered(address hospital);
    event BloodBankRegistered(address bloodBank);

    event InventoryUpdated(
        address bloodBank,
        bytes32 bloodGroup,
        uint256 units
    );

    event RequestCreated(
        uint256 requestId,
        address hospital,
        bytes32 bloodGroup,
        uint256 units
    );

    event RequestReserved(
        uint256 requestId,
        address bloodBank
    );

    event BloodDispatched(uint256 requestId);
    event BloodReceived(uint256 requestId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner allowed");
        _;
    }

    modifier onlyHospital() {
        require(
            roles[msg.sender] == Role.Hospital,
            "Only registered hospital allowed"
        );
        _;
    }

    modifier onlyBloodBank() {
        require(
            roles[msg.sender] == Role.BloodBank,
            "Only registered blood bank allowed"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Register a hospital
    function registerHospital(address hospital)
        external
        onlyOwner
    {
        require(hospital != address(0), "Invalid address");
        require(roles[hospital] == Role.None, "Already registered");

        roles[hospital] = Role.Hospital;

        emit HospitalRegistered(hospital);
    }

    // Register a blood bank
    function registerBloodBank(address bloodBank)
        external
        onlyOwner
    {
        require(bloodBank != address(0), "Invalid address");
        require(roles[bloodBank] == Role.None, "Already registered");

        roles[bloodBank] = Role.BloodBank;

        emit BloodBankRegistered(bloodBank);
    }

    // Update available blood inventory
    function updateInventory(
        bytes32 bloodGroup,
        uint256 units
    )
        external
        onlyBloodBank
    {
        require(bloodGroup != bytes32(0), "Invalid blood group");

        inventory[msg.sender][bloodGroup] = units;

        emit InventoryUpdated(
            msg.sender,
            bloodGroup,
            units
        );
    }

    // Hospital creates an emergency request
    function createRequest(
        bytes32 bloodGroup,
        uint256 units
    )
        external
        onlyHospital
        returns (uint256)
    {
        require(bloodGroup != bytes32(0), "Invalid blood group");
        require(units > 0, "Units must be greater than zero");

        uint256 requestId = nextRequestId++;

        requests[requestId] = BloodRequest({
            requestId: requestId,
            hospital: msg.sender,
            bloodBank: address(0),
            bloodGroup: bloodGroup,
            units: units,
            status: RequestStatus.Open
        });

        emit RequestCreated(
            requestId,
            msg.sender,
            bloodGroup,
            units
        );

        return requestId;
    }

    // Blood bank reserves inventory for a request
    function reserveRequest(uint256 requestId)
        external
        onlyBloodBank
    {
        BloodRequest storage request = requests[requestId];

        require(request.status == RequestStatus.Open, "Request not open");

        require(
            inventory[msg.sender][request.bloodGroup] >= request.units,
            "Insufficient blood inventory"
        );

        inventory[msg.sender][request.bloodGroup] -= request.units;

        request.bloodBank = msg.sender;
        request.status = RequestStatus.Reserved;

        emit RequestReserved(requestId, msg.sender);
    }

    // Blood bank confirms dispatch
    function confirmDispatch(uint256 requestId)
        external
        onlyBloodBank
    {
        BloodRequest storage request = requests[requestId];

        require(request.status == RequestStatus.Reserved, "Not reserved");
        require(request.bloodBank == msg.sender, "Wrong blood bank");

        request.status = RequestStatus.Dispatched;

        emit BloodDispatched(requestId);
    }

    // Hospital confirms receipt
    function confirmReceipt(uint256 requestId)
        external
        onlyHospital
    {
        BloodRequest storage request = requests[requestId];

        require(
            request.hospital == msg.sender,
            "Wrong hospital"
        );

        require(
            request.status == RequestStatus.Dispatched,
            "Not dispatched"
        );

        request.status = RequestStatus.Received;

        emit BloodReceived(requestId);
    }

    // View available inventory
    function getInventory(
        address bloodBank,
        bytes32 bloodGroup
    )
        external
        view
        returns (uint256)
    {
        return inventory[bloodBank][bloodGroup];
    }

    // View request information
    function getRequest(uint256 requestId)
        external
        view
        returns (BloodRequest memory)
    {
        require(
            requests[requestId].status != RequestStatus.None,
            "Request does not exist"
        );

        return requests[requestId];
    }
}
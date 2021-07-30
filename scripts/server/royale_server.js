const royaleServer = server.registerSystem(0, 0);

let playerCount = 0;
let currentPlayers = [];
let masterId = null;
let gameOn = true;  //TODO: Provide ways to stop, start, and reset the game
let unslainPlayers = [];

royaleServer.initialize = function () {
    // Set up chatlog debugging
    var scriptLoggerConfig = this.createEventData('minecraft:script_logger_config');
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

    // Listen for events
    this.listenForEvent("minecraft:player_attacked_entity", (eventData) => this.onAttack(eventData));
    this.listenForEvent("minecraft:entity_death", (eventData) => this.onEntityDeath(eventData));
    this.listenForEvent("royale:player_joined", eventData => this.onPlayerJoined(eventData));
    this.listenForEvent("royale:player_left", eventData => this.onPlayerLeft(eventData));
};

royaleServer.update = function () {
    // Here for debugging purposes
};

royaleServer.sendChatMessage = function (message) {
    let eventData = this.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        this.broadcastEvent("minecraft:display_chat_event", eventData);
    }
};

royaleServer.onAttack = function (eventData) {
    const { player, attacked_entity } = eventData.data;
    if (this.isPlayer(attacked_entity)) {
        this.sendChatMessage(`Player ${player.id} attacked Player ${attacked_entity.id}`);
    }
};

royaleServer.isPlayer = function (entity) {
    return entity.__identifier__ === "minecraft:player";
};

royaleServer.onEntityDeath = function (eventData) {
    const { entity, cause } = eventData.data;

    if (this.isPlayer(entity)) {
        this.sendChatMessage(`Player ${entity.id} has perished by ${cause}.`);
        this.onPlayerLose(entity);
        this.checkForVictory();
    }
}

royaleServer.onPlayerJoined = function (eventData) {
    const { player } = eventData.data;

    playerCount++;
    currentPlayers.push(player);
    unslainPlayers.push(player);

    // If there is one player left, make them the master
    this.setCurrentPlayerAsMaster();
};

royaleServer.onPlayerLeft = function (eventData) {
    const { player } = eventData.data;

    this.sendChatMessage(`Player ${player.id} has left the game.`);

    // Update current players
    playerCount--;
    let playerIndex = currentPlayers.findIndex(p => p.id === player.id);
    currentPlayers = this.removeFromArray(currentPlayers, playerIndex);

    let unslainIndex = unslainPlayers.findIndex(p => p.id === player.id);
    if (unslainIndex > -1) {
        unslainPlayers = this.removeFromArray(unslainPlayers, unslainIndex);
    }

    // If there is one player left, make them the master
    this.setCurrentPlayerAsMaster();
};

royaleServer.onPlayerLose = function (player) {
    let index = unslainPlayers.findIndex(p => p.id === player.id);
    if (index > -1) {
        unslainPlayers = this.removeFromArray(unslainPlayers, index);
    }
}

royaleServer.setCurrentPlayerAsMaster = function () {
    if (currentPlayers.length === 1) {
        masterId = currentPlayers[0].id;
    }
};

royaleServer.checkForVictory = function() {
    if (unslainPlayers.length === 1) {
        this.doVictory();
    }
}

royaleServer.doVictory =  function() {
    const victor = unslainPlayers[0];
    if (victor) {
        this.sendChatMessage(`Victory! Player ${victor.id} is the last player standing!!`);
        this.executeCommand("/function endmessage");
    }
}

royaleServer.removeFromArray = function(array, indexToRemove) {
    return array.slice(0, indexToRemove).concat(array.slice(indexToRemove + 1, array.length));
}


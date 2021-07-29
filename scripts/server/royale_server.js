const royaleServer = server.registerSystem(0, 0);

royaleServer.initialize = function () {
    // Set up chatlog debugging
    var scriptLoggerConfig = this.createEventData('minecraft:script_logger_config');
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

    // Listen for events
    this.listenForEvent("minecraft:player_attacked_entity", (eventData) => this.onAttack(eventData));
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
    this.sendChatMessage(`Player ${player.id} attacked an entity: ${attacked_entity.__identifier__} ${attacked_entity.id}`);
};

royaleServer.isPlayer = function (entity) {
    return this.hasComponent(entity, 'minecraft:inventory_container');
};


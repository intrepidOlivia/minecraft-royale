const royaleClient = client.registerSystem(0, 0);

royaleClient.initialize = function () {
    // Set up chatlog debugging
    var scriptLoggerConfig = this.createEventData('minecraft:script_logger_config');
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

    // Listen for events
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onEnteredWorld(eventData));
};

royaleClient.update = function () {
    // Here for debugging purposes
    // Do I have access to Royale Server from here?
};

royaleClient.onEnteredWorld = function (eventData) {
    this.sendChatMessage("Player has entered the world: " + JSON.stringify(eventData));
};

royaleClient.sendChatMessage = function (message) {
    let eventData = this.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        this.broadcastEvent("minecraft:display_chat_event", eventData);
    }
};

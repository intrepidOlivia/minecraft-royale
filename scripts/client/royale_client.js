const royaleClient = client.registerSystem(0, 0);

let localPlayer = null;
let shutdownEvent = null;

royaleClient.initialize = function () {
    // Set up chatlog debugging
    var scriptLoggerConfig = this.createEventData('minecraft:script_logger_config');
    scriptLoggerConfig.data.log_errors = true;
    scriptLoggerConfig.data.log_information = true;
    scriptLoggerConfig.data.log_warnings = true;
    this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

    // Listen for events
    this.listenForEvent("minecraft:client_entered_world", (eventData) => this.onEnteredWorld(eventData));

    // Register events
    this.registerEventData("royale:player_joined", { player: null });
    this.registerEventData("royale:player_left", { player: null });
};

royaleClient.update = function () {
    // Here for debugging purposes
};

royaleClient.onEnteredWorld = function (eventData) {
    let joinEvent = this.createEventData("royale:player_joined");
    shutdownEvent = this.createEventData("royale:player_left");
    joinEvent.data.player = client.local_player;
    shutdownEvent.data.player = client.local_player;
    localPlayer = client.local_player;
    this.broadcastEvent("royale:player_joined", joinEvent);
    this.sendChatMessage("Player has entered the world: " + JSON.stringify(eventData));
};

royaleClient.sendChatMessage = function (message) {
    let eventData = this.createEventData("minecraft:display_chat_event");
    if (eventData) {
        eventData.data.message = message;
        this.broadcastEvent("minecraft:display_chat_event", eventData);
    }
};

royaleClient.shutdown = function () {
    if (shutdownEvent) {
        this.broadcastEvent("royale:player_left", shutdownEvent);
    }
};

<script lang="ts">
    import type { Schema } from "../schema.ts";
    let connectionUrl = "ws://localhost:8080";
    let connection: WebSocket | undefined;
    let isConnected = false;
    let errorMessage = "";
    let robots: Schema["robots"] = [];

    function onData(data: unknown) {
        if (typeof data === "string") {
            const message: Schema = JSON.parse(data);
            robots = message.robots;
        } else {
            console.warn("Dropping non-string data", data);
        }
    }
</script>

<form
    class="mb-4 max-w-prose flex flex-col gap-4 items-start"
    on:submit|preventDefault={() => {
        console.log("Connecting to", connectionUrl);
        connection = new WebSocket(connectionUrl);
        connection.onopen = () => {
            isConnected = true;
            errorMessage = "";
        };
        connection.onclose = () => {
            isConnected = false;
            connection = undefined;
        };
        connection.onerror = (event) => {
            isConnected = false;
            connection = undefined;
            errorMessage = "Connection failed";
            console.error(event);
        };
        connection.onmessage = (event) => {
            onData(event.data);
        };
    }}
>
    <div>
        <label
            for="connection-url"
            class="block text-neutral-700 text-sm font-bold mb-2"
        >
            Connection URL
        </label>
        <input
            type="text"
            bind:value={connectionUrl}
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="connection-url"
        />
        {#if errorMessage}
            <div class="text-red-500 text-sm">{errorMessage}</div>
        {/if}
    </div>
    <input
        type="submit"
        class="bg-blue-500 active:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer disabled:bg-neutral-400 disabled:cursor-auto"
        disabled={connection !== undefined}
        value={connection === undefined
            ? "Connect"
            : isConnected
              ? "Connected"
              : "…"}
    />
</form>

<div
    class="bg-neutral-100 flex-1 rounded flex flex-col gap-4 overflow-y-scroll"
>
    {#each robots as robot}
        <div class="p-4 rounded shadow text-neutral-700 flex flex-col gap-2">
            <p>Velocity: {robot.velocity}</p>
            <p class="font-bold">{robot.samples.length} Samples</p>
            <div class="overflow-y-scroll font-mono">
                {#each robot.samples as sample}
                    <p>Alliance {sample.alliance}</p>
                    <p>Distance {sample.distance}</p>
                    <p>Timestamp {sample.timestamp}</p>
                    <p>TX {sample.tx}</p>
                    <p>TY {sample.ty}</p>
                {/each}
            </div>
        </div>
    {/each}
</div>

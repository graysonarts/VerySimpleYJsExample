"use strict";

import * as Y from "yjs";
import { SocketIOProvider as SocketProvider } from "@codesee/y-socketio-provider";
// import { WebsocketProvider as SocketProvider } from "y-websocket";

function updateUserCursor(id, x, y) {
  let dc = document.querySelector(`#cursor-${id}`);
  if (!dc) {
    console.warn(`Adding ${id}`);
    const newCursor = document.createElement("div");
    newCursor.id = `cursor-${id}`;
    newCursor.innerHTML = `${id}`;
    newCursor.style.position = "fixed";
    document.querySelector("#cursors").appendChild(newCursor);
    dc = newCursor;
  }

  dc.style.left = `${x}px`;
  dc.style.top = `${y}px`;
}

export const bundle = () => {
  const myId = Math.floor(Math.random() * 1000);
  console.log(`Starting CRDT id: ${myId}`);

  const ydoc = new Y.Doc();
  const provider = new SocketProvider("ws://localhost:4444", "", ydoc);
  // provider.on("status", (event) => {
  //   console.log("Status: " + event.status); // logs "connected" or "disconnected"
  // });
  provider.awareness.on("change", (changes) => {
    const users = [];
    provider.awareness.getStates().forEach((state) => {
      if (state.user) {
        users.push(`<div>${state.user.name}</div>`);
        if (state.cursor) {
          requestAnimationFrame(() => {
            updateUserCursor(state.user.name, state.cursor.x, state.cursor.y);
          });
        }
      }
    });
    document.querySelector("#userList").innerHTML = users.join("");
  });
  const arr = ydoc.getArray("shared-state");
  arr.observe((event) => {
    console.log(event, arr.toJSON());
  });

  provider.awareness.setLocalStateField("user", {
    name: `User${myId}`,
  });

  window.addEventListener(
    "mousemove",
    (evt) => {
      evt.preventDefault();
      if (evt.offsetX < 0 || evt.offsetY < 0) {
        return;
      }
      provider.awareness.setLocalStateField("cursor", {
        x: evt.offsetX,
        y: evt.offsetY,
      });
    },
    false
  );

  return {
    add: () => {
      arr.push([myId]);
    },
    pop: () => {
      arr.delete(0);
    },
    display: () => {
      console.log(arr.toJSON());
    },
  };
};

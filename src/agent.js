const $$$_onMessage = window.onmessage;
const $$$_addEventListener = window.addEventListener;
const $$$_postMessage = window.postMessage;

const $$$listeners = new Set();


const ws = new WebSocket("wss://post.apocalypse:8443/agent-api");

const hub = (event) => {
  const { data, origin } = event
  $$$listeners.forEach(l => l(event));
  let webPipeUrl = new URL("https://post.apocalypse:8443")
  webPipeUrl.searchParams.set("sending_window", origin);
  webPipeUrl.searchParams.set("receiving_window", location.href);
  
  // console.log(event)
  
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      sendingWindow: origin,
      receivingWindow: location.href,
      dataType: typeof(data),
      data
    }))
  }
}

$$$_addEventListener("message", hub);
var $$$onmessage;

Object.defineProperties(window, {
  onmessage: {
    set: (cb) => {
      $$$onmessage = cb;
      if (cb) $$$listeners.add($$$onmessage)
    },
    get: () => $$$onmessage
  },
  // postMessage: {
  //   value: (...args) => {
  //     console.log(args)
  //     $$$_postMessage(...args)
  //   }
  // },
  addEventListener: {
    value: (...args) => {
      const [type, listener, options] = args;
      if (type === "message") {
        return $$$listeners.add(listener)
      }
      $$$_addEventListener(...args);
    },
    configurable:true
  }
})

console.log(`post apocalypse injected to ${location.href}`)
# Post Apocalypse
Post Apocalypse is a tool for researching postMessage communication, it allows you to track, explore and exploit postMessages vulnerabilities, with abilities to replay messages sent between windows of any attached browser.

<img>

# Install
Node is required
```bash
git clone https://github.com/gourarie/post-apocalypse.git
cd post-apocalypse
npm install
```

# How to use
1. Make sure posta server is up and running (via `node posta.js`)
2. Use one of the proxy-helpers to inject the agent.js
3. Make sure your browser is passing through the proxy and agent.js found in responses `head` tag
4. Browse to http://post.apocalypse:28010/ and hack

# How it works? 
Post Apocalypse uses Javascript hooks and wraps postMessages' receievers in order to intercept postMessages by injecting a [agent.js](https://github.com/gourarie/post-apocalypse/blob/master/src/agent.js) script into any website you visit; you can do so easily via [proxy-helpers](https://github.com/gourarie/post-apocalypse/tree/master/proxy-helpers).
The agent communicates with posta server allows you to get a nice UI to investigate on.

# Authors
Chen Gour Arie<br>
[Barak Tawily](https://quitten.github.io/)<br>
Omer Yaron
# Post Apocalypse
Post Apocalypse is a tool for researching postMessage communication, it allows you to track, explore and exploit postMessages vulnerabilities, with abilities to replay messages sent between windows of any attached browser.

![alt tag](https://raw.githubusercontent.com/gourarie/post-apocalypse/master/posta.png)

# Install
Node is required to be installed
```bash
git clone https://github.com/gourarie/post-apocalypse.git
cd post-apocalypse
npm install
```

# How to use
1. Make sure posta server is up and running (via `node posta.js`)
2. Use one of the proxy-helpers to inject the [agent.js](https://github.com/gourarie/post-apocalypse/blob/master/src/agent.js)
3. Make sure your browser is passing through the proxy and agent.js found in responses `head` tag
4. Browse to http://post.apocalypse:28010/ and hack

# How it works? 
Post Apocalypse needs 2 basic features to happen:
1. agent.js to be injected on each HTML response head tag (easily done via [proxy-helpers](https://github.com/gourarie/post-apocalypse/tree/master/proxy-helpers))
2. posta.js server to be up and running

The agent.js hooks and wraps postMessages' receievers in order to intercept postMessages by overwrite all event listeners related to messages handling, each postMessage received by the window managed by agent.js, will be sent to posta.js server, which allows you to view all postMessages on the post-apocalypse UI in order to allow you perform your research easily.

![alt tag](https://raw.githubusercontent.com/gourarie/post-apocalypse/master/posta-architecture.png)
 

# Authors
Chen Gour Arie<br>
[Barak Tawily](https://quitten.github.io/)<br>
Omer Yaron
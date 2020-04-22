### Why proxy?
For optimal setup, you'll need to:
- Serve malwindow and agent from http(+s)://post.apocalypse/...
- Have agent-api & malwindow-api accessible websocket available at ws(+s)://post.apocalypse/...
- have agent.js injected into to every browser Window (excluding post.apocalypse malwindow), prior to any other script.

## Proxy setup
### [Whistle](https://github.com/avwo/whistle)
rules
```
https://post.apocalypse http://127.0.0.1:28010
http://post.apocalypse http://127.0.0.1:28010
wss://post.apocalypse ws://127.0.0.1:28010
ws://post.apocalypse ws://127.0.0.1:28010
!$post.apocalypse * resReplace://{post-apocalypse.json}  includeFilter://resH:content-type=/text\/html/ 
```

replace head to inject agent 
values/post.apocalypse.json
```
<head>:<head><script src="https://post.apocalypse/agent.js"></script>

```

### [Burp](https://portswigger.net/burp)
1. Download [Jython standalone JAR](http://www.jython.org/download.html)
2. Open burp -> Extender -> Options -> Python Environment -> Select File -> Choose the Jython standalone JAR
3. Open Burp -> Extender -> Extensions -> Add -> Choose apocalypse.py file inside post-apocalypse/proxy-helpers/burp directory.
4. From now on, agent.js will be injected into head tag for each HTML response




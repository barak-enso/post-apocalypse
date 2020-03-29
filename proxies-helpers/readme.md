### Why proxy?
For optimal setup, you'll need to:
- Serve malwindow and agent from http(+s)://post.apocalypse/...
- Have agent-api & malwindow-api accessible websocket available at ws(+s)://post.apocalypse/...
- have agent.js injected into to every browser Window (excluding post.apocalypse malwindow), prior to any other script.

This is most easily done using a debugger proxy like burp or [Whistle](https://github.com/avwo/whistle)

## Proxy setup
### Whistle
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

### Burp
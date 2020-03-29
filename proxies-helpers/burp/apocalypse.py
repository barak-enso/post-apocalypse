#!/usr/bin/env python
# -*- coding: utf-8 -*-

from burp import IBurpExtender
from burp import IHttpListener

class BurpExtender(IBurpExtender, IHttpListener):
    def registerExtenderCallbacks(self, callbacks):
        self._callbacks = callbacks
        self._helpers = callbacks.getHelpers()
        self.postApocalypseHost = "post.apocalypse"
        
        callbacks.setExtensionName("PostMessage Apocalypse")
        callbacks.registerHttpListener(self)


    #
    # implement IHttpListener
    #

    def processHttpMessage(self, toolflag, messageIsRequest, messageInfo):
        httpService = messageInfo.getHttpService()

        if messageIsRequest:
            currentHost = httpService.getHost()

            # if request's host is post.apocalypse redirect it to localhost:28010 over http
            if currentHost == self.postApocalypseHost:
                messageInfo.setHttpService(self._helpers.buildHttpService("localhost",
                    28010, "http"))

        else:
            currentHost = httpService.getHost()

            # do not inject script into post.apocalypse
            if currentHost == self.postApocalypseHost:
                return
            
            res = messageInfo.getResponse()
            analyzedRes = self._helpers.analyzeResponse(res)
            
            headers = analyzedRes.getHeaders()
            contentTypeIsHTML = False
            
            injectedScript = """<script type="text/javascript" src="https://{}:28010/agent.js"></script>""".format(self.postApocalypseHost)
            
            newHeaders = []

            # strip CSP header
            for header in headers:
                lheader = header.lower()
                if not lheader.startswith("content-security-policy"):
                    if lheader.startswith("cotent-length"):
                        length = lheader.replace(" ", "").split(":")[1]
                        length = int(length) + len(injectedScript)
                        newHeaders.append("Content-Length: {}".format(str(length)))
                    else:
                        newHeaders.append(header)

                if lheader.startswith("content-type"):
                    if lheader.replace(" ", "").startswith("content-type:text/html"):
                        contentTypeIsHTML = True
            
            # do not inject script into non-html responses.
            if contentTypeIsHTML == False:
                return
            
            resBody = self._helpers.bytesToString(res[analyzedRes.getBodyOffset():])
            
            # TODO: if there is no <head> we need to inject one.
            # adding injected script into header tag
            modifiedResBody = resBody.replace("<head>", "<head>{}\n".format(injectedScript))
            modifiedResponse = self._helpers.buildHttpMessage(newHeaders, self._helpers.stringToBytes(modifiedResBody))
            messageInfo.setResponse(modifiedResponse)

        return


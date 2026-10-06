Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\VAGEESHA\Desktop\my new n8n"
WshShell.Run "cmd /c node server.js", 0, False

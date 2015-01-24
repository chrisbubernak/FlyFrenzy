class Logger {

	private static Queue = [];
	private static MaxQueueLength = 6;

	public static LogInColor(text: string, color: string) {
		// when compiled with jake compile -release 
		// IS_DEBUG gets turned into false in the outputted js
		var IS_DEBUG = true;
		if (IS_DEBUG) {
			var time = new Date();
			var timeString = time.getHours() + ":" + 
				time.getMinutes() + ":" +
				time.getSeconds();
			var newMessage: HTMLDivElement = document.createElement("div");
			newMessage.innerHTML = timeString + " " + text;
			newMessage.classList.add("debugMessage");
			newMessage.style.color = color;

			document.body.appendChild(newMessage);

			// add item to queue
			Logger.Queue.push(newMessage);

			// remove oldest element if queue is too long
			if (Logger.Queue.length > Logger.MaxQueueLength) {
				var stale: HTMLDivElement = Logger.Queue.shift();
				document.body.removeChild(stale);
			}

			for (var i = 0; i < Logger.Queue.length; i++) {
				var cur: HTMLDivElement = Logger.Queue[i];
				cur.style.top = (cur.offsetTop - 18) + "px";
			}
		}
	}

	public static Log(text: string) {
		Logger.LogInColor(text, "#7FFF00");
	}

	public static LogError(text: string) {
		Logger.LogInColor(text, "red");
	}

	public static LogInfo(text: string) {
		Logger.LogInColor(text, "yellow");
	}
}
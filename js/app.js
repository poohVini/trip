function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
}
testWebP(function (support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	}
});

document.addEventListener('DOMContentLoaded', function () {




	let Play = document.querySelector("#play-pause");
	const video = document.querySelector("#video");
	let BigPlayButton = document.querySelector(".play__middlebutton");
	let controlsPlace = document.querySelector(".controls");

	///play-pause///
	Play.addEventListener("click", function () {
		PlayPause();
	});

	BigPlayButton.addEventListener("click", function () {
		PlayPause();
	});

	var ua = navigator.userAgent
	var isMobile = {
		Android: function () {
			return ua.match(/Android/i);
		},
		BlackBerry: function () {
			return ua.match(/BlackBerry/i);
		},
		iOS: function () {
			return ua.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return ua.match(/Opera Mini/i);
		},
		Windows: function () {
			return ua.match(/IEMobile/i);
		},
		Mobile: function () {
			return ua.search(/mobile/i);
		},
		any: function () {
			return ((isMobile.Android() || isMobile.BlackBerry()) || (isMobile.iOS() || isMobile.Opera()) || (isMobile.Windows() || isMobile.Mobile() > 0));
		}
	}

	if (isMobile.any()) {
		document.body.classList.add('_touch');
		video.addEventListener("click", function () {

		});
	} else {
		document.body.classList.add('_pc');
		video.addEventListener("click", function () {

			BigPlayButton.classList.toggle("hidden");
			PlayPause();
		});
	}


	function PlayPause() {
		if (video.paused) {
			video.play();
			Play.classList.remove("play");
		} else if (video.played) {
			video.pause();
			Play.classList.add("play");
		}
	}

	video.addEventListener("play", function () {
		Play.classList.remove("play");
		BigPlayButton.classList.add("play");
		controlsPlace.classList.add("play");

	})

	video.addEventListener("pause", function () {
		Play.classList.add("play");
		BigPlayButton.classList.remove("play");
		controlsPlace.classList.remove("play");
	})
	// /play-pause///


	//time//
	var controls = {
		total: document.querySelector("#grey-line"),
		buffered: document.querySelector("#buffered"),
		progress: document.querySelector("#current"),
		duration: document.querySelector("#duration"),
		duration2: document.querySelector("#duration-2"),
		currentTime: document.querySelector("#currenttime"),
		hasHours: false,
	};

	video.addEventListener("canplay", function () {
		controls.hasHours = (video.duration / 3600) >= 1.0;
		controls.duration.innerHTML = (formatTime(video.duration, controls.hasHours));
		controls.duration2.innerHTML = (formatTime(video.duration, controls.hasHours));
		controls.currentTime.textContent.replace(formatTime(0), controls.hasHours);
	}, false);

	function formatTime(time, hours) {
		if (hours) {
			var h = Math.floor(time / 3600);
			time = time - h * 3600;

			var m = Math.floor(time / 60);
			var s = Math.floor(time % 60);

			return h.lead0(2) + ":" + m.lead0(2) + ":" + s.lead0(2);
		} else {
			var m = Math.floor(time / 60);
			var s = Math.floor(time % 60);

			return m.lead0(2) + ":" + s.lead0(2);
		}
	}

	Number.prototype.lead0 = function (n) {
		var nz = "" + this;
		while (nz.length < n) {
			nz = "0" + nz;
		}
		return nz;
	};

	video.addEventListener("timeupdate", function () {
		controls.currentTime.innerHTML = (formatTime(video.currentTime, controls.hasHours));
		var progress = Math.floor(video.currentTime) / Math.floor(video.duration);
		controls.progress.style.width = Math.floor(progress * controls.total.offsetWidth) + "px";
	}, false);


	video.addEventListener("progress", function () {
		if (video.duration > 0) {
			for (var i = 0; i < video.buffered.length; i++) {
				if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
					controls.buffered.style.width = (video.buffered.end(video.buffered.length - 1 - i) / video.duration) * 100 + "%";
					break;
				}
			}
		}
	});


	controls.total.ondragstart = function () {
		return false;
	};
	controls.total.onmousedown = function (e) {

		var x = e.offsetX / this.offsetWidth;
		video.currentTime = x * video.duration;

		controls.total.onmousemove = function (e) {
			var x = e.offsetX / this.offsetWidth;
			video.currentTime = x * video.duration;
		}
		controls.total.onmouseup = function () {
			controls.total.onmousemove = null;
		}
		controls.total.onmouseleave = function () {
			controls.total.onmousemove = null;
		}
	}
	// /time//


	//volume//
	let volume = document.querySelector("#icon-volume");
	let valueVolume = document.querySelector(".rang");
	let cacheValue;

	//стартовое значение громкости 
	video.volume = valueVolume.value / 100;
	cacheValue = video.volume * 100;

	volume.onclick = function () {
		if (video.muted == true) {
			volume.classList.remove("mute");
			valueVolume.value = cacheValue;
			video.volume = cacheValue / 100;
			iconVolume();
			video.muted = false;
		} else {
			volume.className = "";
			volume.classList.add("mute");
			valueVolume.value = 0;
			video.volume = 0;
			video.muted = true;
		}
	}

	valueVolume.addEventListener("mousedown", function () {
		video.muted = false;
	});
	valueVolume.addEventListener("touchstart", function () {
		video.muted = false;
		iconVolume();
	});


	video.addEventListener("volumechange", function () {
		valueVolume.value = video.volume * 100;
		iconVolume();
		if (video.muted == true) {
			video.volume = 0;
		}
	});

	function iconVolume() {
		if (valueVolume.value > 0 && valueVolume.value < 50) {
			volume.className = "";
			volume.classList.add("min");
		} else if (valueVolume.value >= 50) {
			volume.className = "";
			volume.classList.add("max");
		} else if (valueVolume.value == 0) {
			volume.className = "";
			volume.classList.add("mute");
		}
	}
	iconVolume();

	valueVolume.oninput = function () {
		let v = this.value;
		video.volume = v / 100;
		cacheValue = v;
		iconVolume();
	}
	// /volume//

	//fullscreen//
	video.controls = false;
	let buttonFullscreen = document.querySelector(".fullscreen");
	let VideoContainer = document.querySelector(".video-container")


	buttonFullscreen.onclick = function () {
		let wrapVideo = document.querySelector(".video-container");
		fullscreenElem(wrapVideo);
	}

	function fullscreenElem(element) {
		if (!document.fullscreenElement &&
			!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	}
	document.addEventListener("fullscreenchange", function () {
		video.classList.toggle("fullscreen-window");
		VideoContainer.classList.toggle("fullscreen-container");
		buttonFullscreen.classList.toggle("chang-fullscreen");
	})
	// /fullscreen//


	//playlist//

	// /playlist//
});

let date = document.querySelector(".Dates");
date.onfocus = function () {
	document.querySelector(".label").classList.add("focus");
	document.querySelector(".Dates").classList.add("focus-dates");
};
date.onblur = function () {
	document.querySelector(".label").classList.remove("focus");
	document.querySelector(".Dates").classList.remove("focus-dates");
};


// date.onclick = function () {
// 	if (date.value == 0) {

// 	}

// }

function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector("img")) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	};
}
ibg();
// let menuParents = document.querySelectorAll('.menu__body');
// for (let index = 0; index < menuParents.length; index++) {
// 	const menuParent = menuParents[index];
// 	menuParent.addEventListener("mouseenter", function (e) {
// 		menuParent.classList.add('_active');
// 	});
// 	menuParent.addEventListener("mouseleave", function (e) {
// 		menuParent.classList.remove('_active');
// 	});
// }

let menuPageBurger = document.querySelector('.icon-menu');
let menuPageBody = document.querySelector('.menu__body');
let body = document.querySelector("body");
if (menuPageBurger) {
	menuPageBurger.addEventListener("click", function (e) {
		menuPageBurger.classList.toggle('_active');
		menuPageBody.classList.toggle('_active');
		body.classList.toggle('_lock');
	});
}


window.onload = function () {
	if (document.querySelector('.swiper-container')) {
		const swiper = new Swiper('.swiper-container', {
			// Optional parameters
			slidesPerView: 1,
			spaceBetween: 36,
			direction: 'horizontal',
			// loop: true,
			centeredSlides: true,
			// pagination: {
			// 	el: ".swiper-pagination",
			// 	clickable: true,
			// },

			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next-castom',
				prevEl: '.swiper-button-prev-castom',
			},

			breakpoints: {
				// // when window width is >= 320px
				486: {
					slidesPerView: 2,
					spaceBetween: 36,
					// centeredSlides: false,
				},
				699: {
					slidesPerView: 3,
					spaceBetween: 36,

				},

			},
		});
	}
	if (document.querySelector('.swiper-container-experiences')) {
		const swiperexperiences = new Swiper('.swiper-container-experiences', {
			// Optional parameters
			// slidesPerView: 1,
			// spaceBetween: ,
			centeredSlides: true,
			direction: 'horizontal',
			pagination: {
				el: ".swiper-pagination-experiences",
				clickable: true,
			},

			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next-experiences',
				prevEl: '.swiper-button-prev-experiences',
			},

		});
	}
};













// ==UserScript==
// @name      Retina Yandex Fotki
// @include   http://fotki.yandex.ru/*
// ==/UserScript==
(function () {
	function $(sel, attrs) {
		var os = typeof sel == "object" ? [sel] : document.querySelectorAll(sel);
		for (var e = 0, l = os.length; e < l; e++) {
			var o = os[e];
			for (var i in attrs) {
				if (attrs.hasOwnProperty(i)) {
					if (typeof attrs[i] == 'number') {
						attrs[i] *= o[i] || document.defaultView.getComputedStyle(o, null)[i];
					}
					o[i] = o.style[i] = attrs[i];
				}
			}
		}
		return os[0];
	}
	var img = document.querySelector(".js-img-link img");
	if (img) {
		$(".js-img-link img", {
			marginLeft: 1280 - img.width * 2 + 'px',
			zoom: '.5',
		});
		$(".b-preview__size_xxxl", {
			width: Math.max(640, img.width / 2) + 'px',
			height: img.height / 2 + 'px',
			overflow: 'hidden',
		});
	}
	$(".b-head-logo__img", {
		src: 'http://yandex.st/morda-logo/i/logo.svg',
		width: '89px',
		height: '60px',
		marginBottom: '-30px',
		position: 'relative',
		zIndex: '-1',
	});
	$(".b-head-menu .an-upload", {
		width: '80px',
		height: '17px',
	});
	var img = $(":-webkit-any(.user100, .b-userpic-small) img", {
		width: '40px',
		height: '40px',
		float: 'left',
	});

	if (img && img.src.substr(-6) == '-small') {
		img.src = img.src.substr(0, 84) + 'normal';
		$(img, {
			width: '20px',
			height: '20px',
		});
	}
	$(".b-round", {
		display: 'none',
	});
	$(":-webkit-any(.b-preview, .b-foto-actions, .b-foto-listing-i)", {
		borderRadius: '0px',
		webkitBorderRadius: '0px',
		backgroundColor: 'inherit',
	});
	var imgs = document.getElementsByTagName('img');
	for (var i = 0, l = imgs.length; i < l; i++) {
		imgs[i].src = imgs[i].src.replace(/S$/, 'M').replace(/XM$/, 'S').replace(/XS$/, 'S');
	}
})();

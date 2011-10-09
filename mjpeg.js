// ==UserScript==
// @name        MJPEG+Opera - Add to Opera MJPEG support
// @author      Evgeny Stepanischev aka Bolk
// @version     1.00
// @namespace   http://bolknote.ru/files/opera-mjpeg.js
// @modified    2011-10-09
// @include     *
// ==/UserScript==

opera.addEventListener('BeforeEvent.DOMContentLoaded', function() {
	if (opera.version() < 12) return;

	var BolkMJpeg = function (url, img) {
		var req = new XMLHttpRequest(); 
		img.src = 'about:blank'; // Сброс картинки, чтобы прекратить передачу

		// Асинхронно забираем кадр при помощи XHR, нам придёт видеопоток
		var start = function (url) {
			req.open("GET", url, true);
			 // Свежепридуманный хитрый хак, позволяет получить данные в UCS-2
			req.overrideMimeType('image/jpeg');
			req.send(null);
		}

		// Хитрыми путями восстанавливаем порядок байт в reponse, там сейчас UCS-2,
		// получаем просто последовательность байт
		var reqbytes = function (n, l) {
			return escape(req.response.substr(n, l)).
				replace(/([^%]|%[^u].|%u....)/g, '<$1>').
				replace(/<%u(..)(..)>/g, '%$2%$1').
				replace(/<%(..)>/g, '%$1%00').
				replace(/<(.)>/g, '$1%00');
		}

		// заменяем картинку на бинарные данные
		var draw = function (bin) {
			img.src = 'data:image/jpeg,' + bin;
		}

		// На изменение состояние входных данных собираем по частям JPEG
		req.onreadystatechange = function () {
			// состояние «3» — данные пошли, но ещё не кончились
			console.log(req.readyState);
			if (req.readyState === 3) {
				var hnd = setInterval(function () {
					// по заголовку получаем размер данных
					var header = unescape(reqbytes(0, 300)).toLowerCase();

					var idx = header.indexOf('content-length:');

					if (idx > -1) {
						// 15 — длина заголовка
						var len = parseInt(header.substr(idx + 15), 10);
						var headend = header.indexOf("\r\n\r\n");

						// дожидаемся конца заголовка
						if (headend > -1) {
							var resp = reqbytes(0, len);
							// умножаем всё на три, так как reqbytes даёт esc-последовательность
							// вида %XX%XX…
							len *= 3;
							headend = (headend + 4) * 3;

							// если собрали весь JPEG, обрываем соединение
							// и начинаем новый цикл. Мы могли бы собирать кадры и дальше, но
							// это съест всю память со временем
							if (resp.length >= len + headend) {
								req.abort();
								resp = resp.substr(headend, len);

								draw(resp);
								clearInterval(hnd);

								start(url);
							}
						}
					}
				}, 100);
			}
		}

		start(url);
	};

	// ищем картинку, у которой расширение mjpg
	var imgs = document.getElementsByTagName('IMG');
	for (var i = 0, len = imgs.length; i<len; i++) {
		if (/\.mjpg$/.test(imgs[i].src)) {
			BolkMJpeg(imgs[i].src, imgs[i]);
			break;
		}
	}
}, true);

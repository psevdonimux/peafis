const STORAGE_KEY = 'darkModeLabels';
let isDarkened = false, labels = [], longTouchTimer = null, longPressTimer = null;

const darkOverlay = document.createElement('div');
darkOverlay.id = 'dark-overlay';
darkOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9998;display:none';
document.body.appendChild(darkOverlay);

const getJSON = k => JSON.parse(localStorage.getItem(k) || 'null');
const saveLabels = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(labels.map(({dataset: d}) => ({xVw: +d.xVw, yVh: +d.yVh, text: d.text, link: d.link}))));
const mk = (tag, props) => Object.assign(document.createElement(tag), props);

const createLabel = (x, y, text, link, xVw, yVh) => {
	xVw ??= x / innerWidth * 100;
	yVh ??= y / innerHeight * 100;
	const l = mk('div', {className: 'label', textContent: text});
	l.style.cssText = `left:${xVw}vw;top:${yVh}vh`;
	Object.assign(l.dataset, {link, xVw, yVh, text});
	let ts = 0, tt;
	const stop = e => (e.preventDefault(), e.stopPropagation());
	l.ontouchstart = e => (ts = Date.now(), tt = setTimeout(() => showActionOptions(l), 250), stop(e));
	l.ontouchend = e => (clearTimeout(tt), Date.now() - ts < 250 && navigateToLink(l), stop(e));
	l.ontouchmove = e => (clearTimeout(tt), stop(e));
	l.onclick = () => navigateToLink(l);
	l.oncontextmenu = e => (e.preventDefault(), showActionOptions(l), false);
	return document.body.appendChild(l);
};

const navigateToLink = l => location.href = getJSON('info')?.[l.dataset.text] ?? l.dataset.link;

const showActionOptions = l => {
	const c = mk('div', {className: 'delete-confirm'});
	const btns = mk('div', {className: 'button-container'});
	[['confirm-edit', 'Редактировать', () => (c.remove(), showEditForm(l))],
	 ['confirm-yes', 'Удалить', () => (labels = labels.filter(i => i !== l), l.remove(), saveLabels(), c.remove())],
	 ['confirm-no', 'Отмена', () => c.remove()]
	].forEach(([cls, txt, fn]) => btns.appendChild(mk('button', {className: cls, textContent: txt, onclick: fn})));
	c.append(mk('p', {textContent: 'Действия с меткой:'}), mk('p', {textContent: `"${l.textContent}"`}), btns);
	document.body.appendChild(c);
};

const showEditForm = l => {
	const f = mk('div', {className: 'edit-form'});
	const btns = mk('div', {className: 'button-container'});
	const mkInput = (id, lbl, val) => {
		const g = mk('div', {className: 'input-group'});
		g.append(mk('label', {htmlFor: id, textContent: lbl}), mk('input', {type: 'text', id, value: val}));
		return g;
	};
	btns.append(
		mk('button', {className: 'save-button', textContent: 'Сохранить', onclick: () => {
			const t = f.querySelector('#edit-text').value, k = f.querySelector('#edit-link').value;
			t && k ? (l.textContent = l.dataset.text = t, l.dataset.link = k, saveLabels(), f.remove()) : alert('Текст и ссылка не могут быть пустыми!');
		}}),
		mk('button', {className: 'cancel-button', textContent: 'Отмена', onclick: () => f.remove()})
	);
	f.append(mk('h3', {textContent: 'Редактирование метки'}), mkInput('edit-text', 'Текст:', l.dataset.text), mkInput('edit-link', 'Ссылка:', l.dataset.link), btns);
	document.body.appendChild(f);
};

const toggleDarkMode = () => {
	darkOverlay.style.display = (isDarkened = !isDarkened) ? 'block' : 'none';
	isDarkened ? labels = (getJSON(STORAGE_KEY) || []).map(d => createLabel(null, null, d.text, d.link, d.xVw ?? d.xPercent, d.yVh ?? d.yPercent)) : (labels.forEach(l => l.remove()), labels = []);
};

const addLabel = (x, y) => {
	if (!isDarkened) return;
	const text = prompt('Введите текст для метки:', '');
	if (!text) return;
	const info = getJSON('info'), found = info?.[text];
	if (found && confirm(`Найдена ссылка для "${text}": ${found}\nИспользовать эту ссылку?`))
		return labels.push(createLabel(x, y, text, found)), saveLabels(), alert('Метка создана!');
	const link = prompt('Введите ссылку для этой метки:', '');
	link && (labels.push(createLabel(x, y, text, link)), saveLabels(), alert('Метка создана!'));
};

const isBlocked = e => e.target.classList.contains('label') || e.target.closest('.delete-confirm,.edit-form');

document.onmousedown = e => {
	e.button === 1 && toggleDarkMode();
	isDarkened && !isBlocked(e) && (longPressTimer = setTimeout(() => addLabel(e.clientX, e.clientY), 500));
};
document.onmouseup = () => clearTimeout(longPressTimer);
document.ontouchstart = e => {
	e.touches.length === 2 && toggleDarkMode();
	isDarkened && e.touches.length === 1 && !isBlocked(e) && (longTouchTimer = setTimeout(() => addLabel(e.touches[0].clientX, e.touches[0].clientY), 250));
};
document.ontouchend = document.ontouchmove = () => clearTimeout(longTouchTimer);
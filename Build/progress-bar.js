const progressBar = function (elementId) {
    this.bar = document.getElementById(elementId);
    this.progress = this.bar.getElementsByClassName('progress')[0];
    this.reset()
}

progressBar.prototype.setMax = function (max) {
    if (this.max == max)
        return;

    this.max = max;
    this.update();
}

progressBar.prototype.setCurrent = function (current) {
    if (this.current == current)
        return;

    this.current = current;
    this.update();
}

progressBar.prototype.update = function () {
    let currentPercentage = this.current * 100 / this.max;
    this.progress.style.width = currentPercentage + '%';
}

progressBar.prototype.reset = function () {
    this.setMax(1);
    this.setCurrent(0);
}

progressBar.prototype.hide = function () {
    this.bar.classList.add('hidden');
}

progressBar.prototype.show = function () {
    this.bar.classList.remove('hidden');
}
    

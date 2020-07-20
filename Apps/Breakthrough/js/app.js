//The Breakout game by Tal Korman

$('<audio></audio>').attr('src', 'audio/matka.mp3').on('load', function() {
    $(this).remove();
});
$('<audio></audio>').attr('src', 'audio/brick.mp3').on('load', function() {
    $(this).remove();
});
var xRatio = window.innerWidth,
    yRatio = window.innerHeight,
    brickWidth = xRatio * 0.9 / 20,
    brickHeight = yRatio * 0.03,
    brickArr = [
        []
    ],
    matkaWidth = xRatio * 0.1,
    matkaHeight = yRatio * 0.05,
    matkaX = xRatio / 2,
    deltaMatka,
    ballOnAction = false,
    xBall = xRatio / 2,
    yBall = yRatio * 0.8,
    deltaxBall,
    deltayBall = -2,
    matkaHit = document.createElement('audio'),
    brickHit = document.createElement('audio'),
    ballsQuantity = 3,
    score = 0,
    game = false,
    end = false;

var locateBricks = function(color, row) {
    var nodes = document.querySelectorAll('.' + color + 'Brick');
    brickArr[row] = Array.prototype.slice.call(nodes);
    for (let i = 0; i < 20; i++) {
        $(brickArr[row][i]).css({ 'width': brickWidth + 'px', 'height': brickHeight + 'px', 'background-color': color, 'left': i * brickWidth + xRatio * 0.05, 'top': row * 50 + 100 });
    }
}
var clickStart = setInterval(function() {
    $('#start').fadeTo(100, 0.6).fadeTo(100, 1);
}, 0);

locateBricks('white', 0);
locateBricks('yellow', 1);
locateBricks('pink', 2);
console.log(brickArr);
$('.matka').css({ 'width': xRatio * 0.05, 'height': yRatio * 0.01 });
document.onmousemove = function(e) {
    $('.matka').css({ 'left': e.clientX + 'px' })
    matkaX = e.clientX;
    e.clientY = yRatio / 2;
};
var resetBall = function() {
        deltaxBall = xRatio >= xBall ? -1 : 1;
        deltayBall = -2;
        xBall = xRatio / 2;
        yBall = yRatio * 0.8;
    }
    //on clicking left mouse
$(document).on('click', function(e) {
    if (end) { location.reload() };
    clearInterval(clickStart);
    $('.gameStatus').empty();
    if (ballOnAction) { return };
    ballOnAction = true;
    if (ballsQuantity > 0) { game = true };
    resetBall();
});

var renderGraphic = function() {
    if (!ballOnAction && !game) { return };
    if (xBall + deltaxBall <= 1 || xBall + deltaxBall >= xRatio - 1) { deltaxBall -= deltaxBall * 2 };
    if (yBall + deltayBall <= 1 || (yBall + deltayBall >= yRatio * 0.9 - 1 && xBall >= matkaX && xBall <= matkaX + xRatio * 0.05)) {
        deltayBall -= deltayBall * 2;
        deltaxBall += (matkaX + matkaWidth - xBall) / 200;
        soundMatka();
    };
    if (yBall > yRatio) {
        ballOnAction = false;
        ballsQuantity--;
        $('#balls').html(ballsQuantity);
        pause(1500);
        resetBall();
        return;
    }


    //bricks hit testing and processing
    for (let j = 0; j < brickArr.length; j++) {
        for (let i = 0; i < brickArr[j].length; i++) {
            let brick = brickArr[j][i];
            let br = $(brick).position(),
                ball = $('.ball img').position();
            if (ball.left > br.left && ball.left < br.left + brickWidth &&
                ball.top > br.top && ball.top < br.top + brickHeight) {
                $(brick).remove();
                brickArr[j].splice(i, 1);
                deltayBall -= deltayBall * 2;
                soundBrick();
                score += 1;
                $('#score').html(score);
                break;
            };
        }
    }
    xBall += deltaxBall;
    yBall += deltayBall;
    $('.ball img').css({ 'left': xBall + 'px', 'top': yBall + 'px' });
    if (ballsQuantity < 1) {
        $('<p id="go">Game Over</p>').appendTo('.gameStatus');
        clearInterval(frame);
        $('<p id="start">click left mouse to start</p>').appendTo('.gameStatus');
        end = true;
    }
}

var frame = setInterval(renderGraphic, 5);

var soundMatka = function() {
    matkaHit.src = 'audio/matka.mp3';
    $('body').append(matkaHit);
    matkaHit.play()
}

var soundBrick = function() {
    brickHit.src = 'audio/brick.mp3';
    $('body').append(brickHit);
    brickHit.play();
}

var pause = function(sec) {
    var t = new Date().getTime();
    while (t + sec >= new Date().getTime()) {}
    return
}
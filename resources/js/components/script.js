let position = 0;
const width = document.documentElement.clientWidth;
const slidesToShow = width<=768?4:1;
const slidesToScroll = 1;
const container = document.querySelector('.slider-container');
const track = document.querySelector('.slider-track');

const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const items = document.querySelectorAll('.slider-iteam');
const iteamsCount = items.length;
const iteamWidth = container.clientWidth / slidesToShow;
const movePosition = slidesToScroll * iteamWidth;

items.forEach((item) => {
    item.style.minWidth = `${iteamWidth}px`;
});

btnNext.addEventListener('click', () => {
    const itemsLeft = iteamsCount - (Math.abs(position) + slidesToShow * iteamWidth)/ iteamWidth;
    position-=itemsLeft>=slidesToScroll ? movePosition:itemsLeft*iteamWidth;
    setPosition();
    checkBtns();
});
btnPrev.addEventListener('click', () => {
    const itemsLeft = Math.abs(position)/ iteamWidth;
    position+=itemsLeft>=slidesToScroll ? movePosition:itemsLeft*iteamWidth;
    setPosition();
    checkBtns();
});

const setPosition = () =>{
    track.style.transform = `translateX(${position}px)`;
};

const checkBtns = ()=> {
    btnPrev.disabled = position === 0;
    btnNext.disabled = position <= -(iteamsCount - slidesToShow) * iteamWidth;
};

checkBtns();